import { createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import service from '../../services/service';

export const fetchStudentAnalytics = createAsyncThunk(
  'analytics/fetchStudentAnalytics',
  async (_, thunkAPI) => {
    try {
      const student = await SecureStore.getItemAsync('children');
      if (!student) throw new Error('Student not found in secure store');

      const parsed = JSON.parse(student);
      const studentId = parsed[0]?._id;

      const response = await service.getStudentAnalyticsById(studentId);
      return response.analytics;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch analytics');
    }
  }
);
