import communityReducer from './slices/communitySlice';
import consultationReducer from './slices/consultationSlice';
import healthReducer from './slices/healthSlice';
import userReducer from './slices/userSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    user: userReducer,
    health: healthReducer,
    consultation: consultationReducer,
    community: communityReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;
