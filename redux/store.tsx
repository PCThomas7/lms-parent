import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer from './slices/analytics';

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
  },
});

// Inferred types:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
