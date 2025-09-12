import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import service from "../../services/service";

const getUserDetails = async () => {
  const student = await SecureStore.getItemAsync("children");
  if (!student) throw new Error("Student not found in secure store");

  const parsed = JSON.parse(student);
  const studentId = parsed[0]?._id;
  return studentId;
};

export const fetchStudentAnalytics = createAsyncThunk(
  "analytics/fetchStudentAnalytics",
  async (_, thunkAPI) => {
    try {
      const studentId = await getUserDetails();

      const response = await service.getStudentAnalyticsById(studentId);
      return response.analytics;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch analytics"
      );
    }
  }
);

export const fetchStudentReport = createAsyncThunk(
  "report/fetchStudentReport",
  async (_, thunkAPI) => {
    try {
      const studentId = await getUserDetails();
      const response = await service.getStudentReports(studentId);
      return response; // or response.data if that's where your array is
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch reports"
      );
    }
  }
);

export const fetchQuiz = createAsyncThunk(
  "quiz/fetchQuiz",
  async (quizId, thunkAPI) => {
    try {
      const response = await service.getQuiz(quizId);
      return response.quiz;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Quiz not fetched");
    }
  }
);
