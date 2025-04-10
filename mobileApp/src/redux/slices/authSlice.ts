import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { encode, decode } from 'js-base64';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authRequest: state => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (
      state,
      action: PayloadAction<{token: string; user: User}>,
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = encode(action.payload.token);
      state.user = action.payload.user;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {authRequest, authSuccess, authFailure, logout, clearError} =
  authSlice.actions;

export default authSlice.reducer;
