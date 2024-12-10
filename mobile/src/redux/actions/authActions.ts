import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '../../services/auth.service';
import { setUser, setToken } from '../slices/authSlice';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    try {
      const authService = new AuthService();
      const response = await authService.login(credentials);
      
      dispatch(setUser(response.user));
      dispatch(setToken(response.token));
      
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      const authService = new AuthService();
      await authService.logout();
      
      dispatch(setUser(null));
      dispatch(setToken(null));
    } catch (error) {
      throw error;
    }
  }
); 