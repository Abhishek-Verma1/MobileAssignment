import axios from 'axios';
import { Platform } from 'react-native';
import { store } from '../redux/store';
import {
  formatApiError,
  getApiBaseUrl,
  getCommonHeaders,
} from '../utils/apiHelper';
import { decode } from 'js-base64';

//TODO: Code cleaning and optimization required

let API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: getCommonHeaders(),
  timeout: 15000,
});

export const updateApiBaseUrl = (newBaseUrl: string) => {
  API_BASE_URL = newBaseUrl;
  api.defaults.baseURL = newBaseUrl;
};

//TODO: Can write in a better way also
export const tryAlternativeApiPorts = async () => {
  const ports =
    Platform.OS === 'android' ? [8000, 8080, 3000] : [8080, 8000, 3000];
  const baseHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  for (const port of ports) {
    const url = `http://${baseHost}:${port}`;
    try {
      const response = await fetch(`${url}/system/health`, {
        method: 'HEAD',
      });
      if (response.status !== 0) {
        updateApiBaseUrl(url);
        return true;
      }
    } catch (error) {
      try {
        const gameResponse = await fetch(`${url}/game/create_game_session`, {
          method: 'HEAD',
        });
        if (gameResponse.status !== 404) {
          updateApiBaseUrl(url);
          return true;
        }
      } catch (gameError) {
        console.log(`Game endpoint on port ${port} not reachable:`, gameError);
      }
    }
  }
  console.warn('No alternative API ports found');
  return false;
};
  
api.interceptors.request.use(
  config => {
    const state = store.getState();
    let token = state.auth?.token;
    if(token) token = decode(token)
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    if (__DEV__) {
      console.log(`API Response [${response.status}]:`, response.data);
    }
    return response;
  },
  async error => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn(
          'Authentication error: Token may have expired or is invalid',
        );
      }
    } else if (error.request) {
      if (__DEV__) {
        const found = await tryAlternativeApiPorts();
        if (found) {
          const config = error.config;
          config.baseURL = API_BASE_URL;
          try {
            return await axios(config);
          } catch (retryError) {
          }
        }
      }
    } else {
      //TODO
    }
    const formattedError = formatApiError(error);
    console.warn('Formatted API error message:', formattedError);
    return Promise.reject(error);
  },
);

export default api;
