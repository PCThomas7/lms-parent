import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchQuiz } from "./Thunk";

// Interfaces
interface Tags {
  exam_type:string;
  subject:string;
  chapter:string;
  topic:string;
  difficulty_level:string;
  question_type:string;
  source:string;
}


interface Question {
  _id: string;
  question_text: string;
  correct_answer: string;
  explanation: string;
  image_url:string;
  tags:Tags
  // Add more if needed
}

interface Section {
  _id: string;
  name: string;
  timerEnabled: boolean;
  marks_per_question: number;
  negative_marks: number;
  questions: Question[];
}

interface Quiz {
  _id: string;
  title: string;
  timeLimit: number;
  quizMode: string;
  subject: string;
  exam_type: string;
  passingScore: number;
  description: string;
  metadata: {
    footer: string[];
    header: string[];
    instructions: string[];
  };
  sections: Section[];
  createdBy: {
    _id: string;
    email: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Slice state
interface QuizState {
  quizData: Quiz | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: QuizState = {
  quizData: null,
  loading: false,
  error: null,
};

// Slice
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizData = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default quizSlice.reducer;

// Base selector
export const selectQuizData = (state: RootState) => state.quiz.quizData;

// Sections selector
export const selectSections = createSelector(
  [selectQuizData],
  (quizData) => quizData?.sections || []
);

// Total Questions
export const selectTotalQuestions = createSelector(
  [selectSections],
  (sections) =>
    sections.reduce((total, sec) => total + (sec.questions?.length || 0), 0)
);

// Total Marks
export const selectTotalMarks = createSelector(
  [selectSections],
  (sections) =>
    sections.reduce((total, sec) => {
      const marksPerQ = sec.marks_per_question || 0;
      const count = sec.questions?.length || 0;
      return total + marksPerQ * count;
    }, 0)
);

// Selector to get a specific section by name (optional)
export const selectSectionByName = (name: string) =>
  createSelector([selectSections], (sections) =>
    sections.find((sec) => sec.name.toLowerCase() === name.toLowerCase())
  );
