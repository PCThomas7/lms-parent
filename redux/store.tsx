import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer from './slices/analytics';
import reportSlice from './slices/report'
import quizSlice from './slices/quizSlice'

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    reports : reportSlice,
    quiz:quizSlice
  },
});

// Inferred types:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
