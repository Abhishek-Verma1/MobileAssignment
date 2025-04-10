import connectivityManager from '../utils/connectivityManager';
import api from './apiConfig';


//TODO: Code cleaning and optimization required

const login = async (email: string, password: string) => {
  if (!connectivityManager.isConnected()) {
    throw new Error(
      'No internet connection......',
    );
  }
  try {
    const response = await api.post('/auth/login', {email, password});
    return response.data;
  } catch (error) {
    throw error;
  }
};

const register = async (name: string, email: string, password: string) => {
  if (!connectivityManager.isConnected()) {
    throw new Error(
      'No internet connection.....',
    );
  }
  try {
    const response = await api.post('/auth/register', {name, email, password});
    return response.data;
  } catch (error) {
    throw error;
  }
};

const AuthService = {
  login,
  register
};

export default AuthService;
