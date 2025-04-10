import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { resetGame } from '@redux/slices/gameSlice';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../api/authService';
import {
  authFailure,
  authRequest,
  authSuccess,
  clearError as clearAuthError,
  logout as logoutAction,
} from '../redux/slices/authSlice';
import { persistor, RootState } from '../redux/store';
import useNetwork from './useNetwork';

//TODO: Possible to do more modular code.
const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
   const navigation = useNavigation<StackNavigationProp<any>>();
  const response =  useNetwork();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(authRequest());
        const data = await AuthService.login(email, password);
        dispatch(authSuccess(data));
        navigation.navigate("MainTabs")
        return data;
      } catch (error: any) {
        let errorMessage = 'Failed to login. Please try again....';

        if (error.response && error.response.data) {
          // console.log('Server error response:', error.response.data);
          errorMessage = error.response.data.error || errorMessage;

          Alert.alert(
            'Login Error',
            'Invalid email or password',
            [
              {text: 'Okay', style: 'cancel'}
            ],
          );
        } else if (error.request) {
          console.log('Network error (no response):', error.request);
          errorMessage = 'Network error. Please check your connection.';
        } else {
          console.log('Error setting up request:', error.message);
        }
        dispatch(authFailure(errorMessage));
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        dispatch(authRequest());
        const data = await AuthService.register(name, email, password);
        dispatch(authSuccess(data));
        navigation.navigate("MainTabs")
        return data;
      } catch (error: any) {
        let errorMessage = 'Failed to register. Please try again.....';
        if (error.response && error.response.data) {
          console.log('Server error response:', error.response.data);
          errorMessage = error.response.data.error || errorMessage;
          Alert.alert(
            'Registration Error',
            errorMessage,
            [
              {text: 'Okay', style: 'cancel'}
            ],
          );
        } else if (error.request) {
          console.log('Network error (no response):', error.request);
          errorMessage = 'Network error. Please check your connection.';
        } else {
          console.log('Error setting up request:', error.message);
        }
        dispatch(authFailure(errorMessage));
      }
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(resetGame());

    persistor.purge();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
  };
};

export default useAuth;
