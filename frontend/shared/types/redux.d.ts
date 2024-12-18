import { RootState } from '../store/types';
import { ThunkAction, Action } from '@reduxjs/toolkit';

// Redux Action类型
export interface IBaseAction<T = any> extends Action<string> {
  /** payload 的描述 */
  payload?: T;
  /** error 的描述 */
  error?: boolean;
  /** meta 的描述 */
  meta?: any;
}

// Redux Thunk类型
export type AppThunkType<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Redux State类型
export interface IAuthState {
  /** user 的描述 */
  user: any | null;
  /** token 的描述 */
  token: string | null;
  /** loading 的描述 */
  loading: boolean;
  /** error 的描述 */
  error: string | null;
}

export interface IHealthState {
  /** data 的描述 */
  data: any[];
  /** loading 的描述 */
  loading: boolean;
  /** error 的描述 */
  error: string | null;
}

export interface IUIState {
  /** theme 的描述 */
  theme: 'light' | 'dark';
  /** language 的描述 */
  language: string;
  /** notifications 的描述 */
  notifications: boolean;
}

// Redux Store类型
export interface IReduxStore {
  /** dispatch 的描述 */
  dispatch: (action: IBaseAction | AppThunkType) => any;
  /** getState 的描述 */
  getState: () => RootState;
  /** subscribe 的描述 */
  subscribe: (listener: () => void) => () => void;
}
