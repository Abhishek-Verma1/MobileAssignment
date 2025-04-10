import api from './apiConfig';

//TODO: Code cleaning and optimization required

const playerMove = async (board: number[][], sessionId: string) => {
  try {
    const response = await api.post('/game/player_move', {board, sessionId});
    return {
      board: response.data.board
        ? typeof response.data.board === 'string'
          ? JSON.parse(response.data.board.replace(/'/g, '"'))
          : response.data.board
        : board,
      status: response.data.status || response.data.gameStatus,
      sessionId: response.data.id || sessionId,
      currentPlayer: response.data.currentPlayer === 'x' ? -1 : 1,
      winner: response.data.winner,
    };
  } catch (error) {
   console.warn(error)
  }
};

const getPlayerStats = async () => {
  const response = await api.get('/player/stats');
  return response.data;
};

const getPlayerProfile = async () => {
  const response = await api.get('/player/profile');
  return response.data;
};

const PlayerService = {
  playerMove,
  getPlayerStats,
  getPlayerProfile,
};

export default PlayerService;
