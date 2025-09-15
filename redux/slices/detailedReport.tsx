// redux/slices/detailedReport.ts
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { fetchDetailedReport } from "./Thunk";

// -------------------- TYPES --------------------

// Overall performance summary
export interface OverallPerformance {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
}

// Subject-wise performance
export interface SubjectPerformance {
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  maxScore: number;
  percentage: number;
}

// Chapter-wise performance
export interface ChapterPerformance extends SubjectPerformance {
  chapter: string;
}

// Topic-wise performance
export interface TopicPerformance extends ChapterPerformance {
  topic: string;
}

// Difficulty-wise performance
export interface DifficultyPerformance {
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  maxScore: number;
  percentage: number;
}

// Question-type performance
export interface QuestionTypePerformance {
  questionType: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  maxScore: number;
  percentage: number;
}

// Full Detailed Report
export interface DetailedReport {
  attemptId: string;
  message: string;
  report: {
    overallPerformance: OverallPerformance;
    subjectWisePerformance: SubjectPerformance[];
    chapterWisePerformance: ChapterPerformance[];
    topicWisePerformance: TopicPerformance[];
    difficultyWisePerformance: DifficultyPerformance[];
    questionTypePerformance: QuestionTypePerformance[];
  };
}

// -------------------- STATE --------------------

interface AnalyticsState {
  loading: boolean;
  error: string | null;
  data: DetailedReport | null;
}

const initialState: AnalyticsState = {
  loading: false,
  error: null,
  data: null,
};

// -------------------- SLICE --------------------

const detailedReport = createSlice({
  name: "detailedReport",
  initialState,
  reducers: {
    resetAnalytics: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailedReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailedReport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchDetailedReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error?.message ||
          "Failed to fetch detailed Report";
      });
  },
});

export const { resetAnalytics } = detailedReport.actions;

// -------------------- SELECTORS --------------------

export const selectDetailedReport = (state: RootState) =>
  state.detailedReport.data;

export const selectOverallPerformance = (state: RootState) =>
  state.detailedReport.data?.report.overallPerformance;

export const selectSubjectWise = (state: RootState) =>
  state.detailedReport.data?.report.subjectWisePerformance;

export const selectChapterWise = (state: RootState) =>
  state.detailedReport.data?.report.chapterWisePerformance;

export const selectTopicWise = (state: RootState) =>
  state.detailedReport.data?.report.topicWisePerformance;

export const selectDifficultyWise = (state: RootState) =>
  state.detailedReport.data?.report.difficultyWisePerformance;

export const selectQuestionType = (state: RootState) =>
  state.detailedReport.data?.report.questionTypePerformance;

export default detailedReport.reducer;
