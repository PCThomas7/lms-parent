import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer from './slices/analytics';
import reportSlice from './slices/report'
import quizSlice from './slices/quizSlice'
import detailedReportSlilce from './slices/detailedReport'

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    reports : reportSlice,
    quiz:quizSlice,
    detailedReport:detailedReportSlilce,
  },
});

// Inferred types:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
