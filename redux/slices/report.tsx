// redux/slices/reportSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchStudentReport } from "./Thunk";
import type { RootState } from '../store'; 

interface quizData {
  id: string;
  title: string;
  description: string;
}

interface quizAnswers {
  [questionId: string]: string[];
}

interface reportItem {
  id: string;
  quiz: quizData;
  user: string;
  answers: quizAnswers;
  score: number;
  maxScore: number;
  timespent: number;
  completed: boolean;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedAnswers: number;
  attemptNumber: number;
  submittedAt: string;
}

interface AnalyticsState {
  loading: boolean;
  error: string | null;
  data: reportItem[];
}

const initialState: AnalyticsState = {
  loading: false,
  error: null,
  data: [],
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    resetAnalytics: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStudentReport.fulfilled,
        (state, action: PayloadAction<reportItem[]>) => {
          state.loading = false;
          state.error = null;
          state.data = action.payload;
          // console.log("reportData in slice : ",action.payload)
        }
      )
      .addCase(fetchStudentReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error?.message ||
          "Failed to fetch analytics";
      });
  },
});

export const { resetAnalytics } = reportSlice.actions;
type SliceContainer = { reports: AnalyticsState };

export const selectreport = (state: RootState) =>
  state.reports.data;

export default reportSlice.reducer;
