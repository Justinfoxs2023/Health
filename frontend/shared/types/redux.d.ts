import { ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from '../store/types';

// Redux Action类型
export interface BaseAction<T = any> extends Action<string> {
  payload?: T;
  error?: boolean;
  meta?: any;
}

// Redux Thunk类型
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Redux State类型
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

export interface UIState {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

// Redux Store类型
export interface ReduxStore {
  dispatch: (action: BaseAction | AppThunk) => any;
  getState: () => RootState;
  subscribe: (listener: () => void) => () => void;
} 