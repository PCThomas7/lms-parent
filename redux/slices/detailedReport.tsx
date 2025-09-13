import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { fetchDetailedReport } from "./Thunk";

interface AnalyticsState {
  loading: boolean;
  error: string | null;
  data: any[]; // use `any[]` if you don't have a defined type yet
}

const initialState: AnalyticsState = {
  loading: false,
  error: null,
  data: [],
};

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
        console.log("datat in slice : ",action.payload)
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

export const selectDetailedReport = (state: RootState) =>
  state.detailedReport.data;

export default detailedReport.reducer;
