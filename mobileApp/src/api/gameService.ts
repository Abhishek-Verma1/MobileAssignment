import {Platform} from 'react-native';
import {store} from '../redux/store';
import connectivityManager from '../utils/connectivityManager';
import api, {updateApiBaseUrl} from './apiConfig';

//TODO: Code cleaning and optimization required

//TODO: Can write in a better way also
const findGameEndpoint = async (): Promise<string | null> => {
  const defaultUrl = api.defaults.baseURL || '';
  const ports =
    Platform.OS === 'android' ? [8080, 8000, 3000] : [8080, 8000, 3000];
  const baseHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  try {
    const response = await fetch(`${defaultUrl}/game/create_game_session`, {
      method: 'HEAD',
    });
    if (response.status !== 404) {
      return defaultUrl;
    }
  } catch (error) {
    console.log(`Default API URL didn't work for game endpoints: ${error}`);
  }
  for (const port of ports) {
    const url = `http://${baseHost}:${port}`;
    if (url === defaultUrl) continue;
    try {
      const response = await fetch(`${url}/game/create_game_session`, {
        method: 'HEAD',
      });
      if (response.status !== 404) {
        return url;
      }
    } catch (error) {
      console.log(`Port ${port} not suitable for game endpoints: ${error}`);
    }
  }
  console.log('Could not find a working game endpoint');
  return null;
};


//TODO: Lots of extra and dirty and debug code, cleaning and optimization required
const createGameSession = async (startWithPlayer: boolean) => {
  try {
    if (!connectivityManager.isConnected()) {
      throw new Error('No network connection. Please check your settings.');
    }
    const state = store.getState();
    const authToken = state.auth?.token;
    const isAuthenticated = state.auth?.isAuthenticated;
    console.log('Checking auth state before creating game session:', {
      isAuthenticated,
      hasToken: Boolean(authToken),
      tokenLength: authToken ? authToken.length : 0,
    });
    if (!isAuthenticated || !authToken) {
      throw new Error('Authentication required. Please log in and try again.');
    }
    if (authToken.startsWith('mockToken')) {
      return {
        sessionId: 'mock-session-' + Math.floor(Math.random() * 1000),
        status: 'ongoing',
        board: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        currentPlayer: startWithPlayer ? -1 : 1,
        startWithPlayer: startWithPlayer,
      };
    }
    const gameEndpointBaseUrl = await findGameEndpoint();
    if (gameEndpointBaseUrl && gameEndpointBaseUrl !== api.defaults.baseURL) {
      updateApiBaseUrl(gameEndpointBaseUrl);
    }
    const authHeader = api.defaults.headers.common['Authorization'];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await api.post(
      '/game/create_game_session',
      {startWithPlayer},
      {signal: controller.signal},
    );

    clearTimeout(timeoutId);

    if (!response.data || !response.data.id) {
      throw new Error('Invalid response from server. Missing session data.');
    }

    const formattedData = {
      sessionId: response.data.id,
      status: response.data.status,
      board: response.data.board
        ? typeof response.data.board === 'string'
          ? JSON.parse(response.data.board.replace(/'/g, '"'))
          : response.data.board
        : [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
      currentPlayer: response.data.currentPlayer === 'x' ? -1 : 1,
      winner: response.data.winner,
    };
    return formattedData;
  } catch (error: any) {

    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      throw new Error(
        'Request timed out. The server is taking too long to respond.',
      );
    }
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error(
          'Authentication required. Please log in and try again.',
        );
      }
      if (error.response.status === 403) {
        throw new Error(
          'Access denied. You do not have permission to perform this action.',
        );
      }
      if (error.response.status === 404) {
        try {
          const alternativeEndpoint = await findGameEndpoint();
          if (alternativeEndpoint) {
            updateApiBaseUrl(alternativeEndpoint);
            return createGameSession(startWithPlayer);
          }
        } catch (endpointError) {
          //TODO
        }
        throw new Error(
          'API endpoint not found. The game service might be misconfigured.',
        );
      }
      if (error.response.status >= 500) {
        throw new Error('Server error occurred. Please try again later.');
      }
      throw new Error(error.response.data?.message || 'Server error occurred');
    } else if (error.request) {
      try {
        const ports =
          Platform.OS === 'android' ? [8000, 8080, 3000] : [8080, 8000, 3000];
        const baseHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
        const state = store.getState();
        const authToken = state.auth?.token;
        if (!authToken) {
          throw new Error('Authentication token missing for direct fetch');
        }

        for (const port of ports) {
          try {
            const url = `http://${baseHost}:${port}/game/create_game_session`;
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({startWithPlayer}),
            });

            if (response.ok) {
              const data = await response.json();
              if (data && data.id) {
                const formattedData = {
                  sessionId: data.id,
                  status: data.status,
                  board: data.board
                    ? typeof data.board === 'string'
                      ? JSON.parse(data.board.replace(/'/g, '"'))
                      : data.board
                    : [
                        [0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 0],
                      ],
                  currentPlayer: data.currentPlayer === 'x' ? -1 : 1,
                  winner: data.winner,
                };
                updateApiBaseUrl(`http://${baseHost}:${port}`);
                return formattedData;
              }
            }
          } catch (fetchError) {
            console.log(`Direct fetch to port ${port} failed:`, fetchError);
          }
        }
      } catch (directError) {
       //TODO
      }
      throw new Error('Network error. Could not reach the server.');
    } else {
      throw new Error('Request configuration error: ' + error.message);
    }
  }
};

export const createGameSessionRobust = async (startWithPlayer: boolean) => {
  const state = store.getState();
  const authToken = state.auth?.token;
  const isAuthenticated = state.auth?.isAuthenticated;

  console.log('Authentication check before robust game session creation:', {
    isAuthenticated,
    hasToken: Boolean(authToken),
    tokenLength: authToken ? authToken.length : 0,
  });

  if (!isAuthenticated || !authToken) {
    throw new Error('Authentication required. Please log in and try again.');
  }

  if (authToken.startsWith('mockToken')) {
    console.log(
      'Using mock token in robust function - returning simulated game session',
    );
    return {
      sessionId: 'mock-session-' + Math.floor(Math.random() * 1000),
      status: 'ongoing',
      board: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      currentPlayer: startWithPlayer ? -1 : 1,
      startWithPlayer: startWithPlayer,
    };
  }

  try {
    return await createGameSession(startWithPlayer);
  } catch (error: any) {
    console.log('Initial game session creation failed, trying alternatives');

    try {
      console.log('Attempting to create game session with direct fetch...');
      const ports =
        Platform.OS === 'android' ? [8000, 8080, 3000] : [8080, 8000, 3000];
      const baseHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

      for (const port of ports) {
        const url = `http://${baseHost}:${port}/game/create_game_session`;
        try {
          console.log(`Testing ${url} via direct fetch...`);

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({startWithPlayer}),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Direct fetch succeeded:', data);

            const formattedData = {
              sessionId: data.id,
              status: data.status,
              board: data.board
                ? typeof data.board === 'string'
                  ? JSON.parse(data.board.replace(/'/g, '"'))
                  : data.board
                : [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                  ],
              currentPlayer: data.currentPlayer === 'x' ? -1 : 1,
              winner: data.winner,
            };

            updateApiBaseUrl(`http://${baseHost}:${port}`);

            return formattedData;
          } else {
            console.log(
              `Response from ${url}: ${response.status} ${response.statusText}`,
            );
          }
        } catch (fetchError) {
          console.log(`Direct fetch to ${url} failed:`, fetchError);
        }
      }
    } catch (directError) {
    }

    throw error;
  }
};

const getGameSession = async (sessionId: string) => {
  try {
    console.log(`Getting game session: ${sessionId}`);
    const response = await api.get(`/game/session/${sessionId}`);

    if (!response.data || !response.data.id) {
      throw new Error('Invalid response from server. Missing session data.');
    }

    const formattedData = {
      sessionId: response.data.id,
      status: response.data.status,
      board: response.data.board
        ? typeof response.data.board === 'string'
          ? JSON.parse(response.data.board.replace(/'/g, '"'))
          : response.data.board
        : [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
      currentPlayer: response.data.currentPlayer === 'x' ? -1 : 1,
      winner: response.data.winner,
    };

    return formattedData;
  } catch (error: any) {
    throw error;
  }
};

const checkBoard = async (board: number[][]) => {
  try {
    console.log('Checking board state');
    const response = await api.post('/game/check', {board});
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const GameService = {
  createGameSession,
  createGameSessionRobust,
  getGameSession,
  checkBoard,
};

export default GameService;
