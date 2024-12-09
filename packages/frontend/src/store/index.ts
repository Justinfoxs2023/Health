import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import healthReducer from './slices/healthSlice';
import consultationReducer from './slices/consultationSlice';
import communityReducer from './slices/communitySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    health: healthReducer,
    consultation: consultationReducer,
    community: communityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 