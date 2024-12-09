import { store } from '../store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

declare module '@reduxjs/toolkit' {
  interface AsyncThunkConfig {
    state: RootState;
    dispatch: AppDispatch;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
  }
}

// Redux Slice类型
export interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface HealthState {
  data: any[];
  loading: boolean;
  error: string | null;
}

export interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
} 