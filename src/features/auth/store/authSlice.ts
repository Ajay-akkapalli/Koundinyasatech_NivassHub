import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, AuthToken } from '../types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<AuthToken>) {
      state.token = action.payload;
    },
    setAuth(state, action: PayloadAction<{ user: User; token: AuthToken }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, setToken, setAuth, clearAuth, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;
