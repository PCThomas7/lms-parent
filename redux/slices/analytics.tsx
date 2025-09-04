import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchStudentAnalytics } from './Thunk'
import type { RootState } from '../store'; 

/* ---------- Types for the payload ---------- */

export interface SubjectPerformanceItem {
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface DifficultyPerformanceItem {
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface QuestionTypePerformanceItem {
  questionType: 'MCQ' | 'MMCQ' | 'Numeric' | string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface RecentPerformanceItem {
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string; // ISO timestamp
}

export interface TimeSpentAnalysis {
  totalTimeSpent: number;          // seconds
  averageTimePerQuiz: number;      // seconds
  averageTimePerQuestion: number;  // seconds
}

/** Shape returned by your API for analytics */
export interface AnalyticsPayload {
  totalAttempts: number;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;

  subjectPerformance: SubjectPerformanceItem[];
  difficultyPerformance: DifficultyPerformanceItem[];
  questionTypePerformance: QuestionTypePerformanceItem[];
  recentPerformance: RecentPerformanceItem[];

  timeSpentAnalysis: TimeSpentAnalysis | null;
}

/* ---------- Slice state ---------- */

export interface AnalyticsState {
  // simple fields
  totalAttempts: number;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;

  // array fields
  subjectPerformance: SubjectPerformanceItem[];
  difficultyPerformance: DifficultyPerformanceItem[];
  questionTypePerformance: QuestionTypePerformanceItem[];
  recentPerformance: RecentPerformanceItem[];

  // object field
  timeSpentAnalysis: TimeSpentAnalysis | null;

  // meta
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  totalAttempts: 0,
  averageScore: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  unattempted: 0,

  subjectPerformance: [],
  difficultyPerformance: [],
  questionTypePerformance: [],
  recentPerformance: [],

  timeSpentAnalysis: null,

  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    resetAnalytics: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStudentAnalytics.fulfilled,
        (state, action: PayloadAction<AnalyticsPayload>) => {
          state.loading = false;
          const data = action.payload;

          // scalars
          state.totalAttempts = data.totalAttempts;
          state.averageScore = data.averageScore;
          state.totalQuestions = data.totalQuestions;
          state.correctAnswers = data.correctAnswers;
          state.incorrectAnswers = data.incorrectAnswers;
          state.unattempted = data.unattempted;

          // arrays
          state.subjectPerformance = data.subjectPerformance ?? [];
          state.difficultyPerformance = data.difficultyPerformance ?? [];
          state.questionTypePerformance = data.questionTypePerformance ?? [];
          state.recentPerformance = data.recentPerformance ?? [];

          // object
          state.timeSpentAnalysis = data.timeSpentAnalysis ?? null;
        }
      )
      .addCase(fetchStudentAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error?.message ||
          'Failed to fetch analytics';
      });
  },
});

export const { resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;

/* ---------- Selectors (export arrays & fields individually) ---------- */
/* If you have RootState in your store, prefer:
   (state: RootState) => state.analytics.…
   For now we define a minimal container type. */

type SliceContainer = { analytics: AnalyticsState };

export const selectAnalyticsLoading = (state: RootState) =>
  state.analytics.loading;
export const selectAnalyticsError = (state: RootState) =>
  state.analytics.error;

export const selectTotalAttempts = (state: RootState) =>
  state.analytics.totalAttempts;
export const selectAverageScore = (state: RootState) =>
  state.analytics.averageScore;
export const selectTotalQuestions = (state: RootState) =>
  state.analytics.totalQuestions;
export const selectCorrectAnswers = (state: RootState) =>
  state.analytics.correctAnswers;
export const selectIncorrectAnswers = (state: RootState) =>
  state.analytics.incorrectAnswers;
export const selectUnattempted = (state: RootState) =>
  state.analytics.unattempted;

export const selectSubjectPerformance = (state: RootState) =>
  state.analytics.subjectPerformance;
export const selectDifficultyPerformance = (state: RootState) =>
  state.analytics.difficultyPerformance;
export const selectQuestionTypePerformance = (state: RootState) =>
  state.analytics.questionTypePerformance;
export const selectRecentPerformance = (state: RootState) =>
  state.analytics.recentPerformance;

export const selectTimeSpentAnalysis = (state: RootState) =>
  state.analytics.timeSpentAnalysis;