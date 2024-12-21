import { store } from '../store';

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;

declare module '@reduxjs/toolkit' {
  interface AsyncThunkConfig {
    state: RootStateType;
    dispatch: AppDispatchType;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
  }
}

// Redux Slice类型
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

export interface ISettingsState {
  /** theme 的描述 */
  theme: 'light' | 'dark';
  /** language 的描述 */
  language: string;
  /** notifications 的描述 */
  notifications: boolean;
}
