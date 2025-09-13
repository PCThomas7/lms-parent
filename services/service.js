import { api } from "./api";

const service = {
  getStudentAnalyticsById: async (studentId) => {
    try {
      const timeRange = "all";
      const response = await api.get(
        `/student/analytics/${studentId}?timeRange=${timeRange}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student analytics by ID:", error);
      throw error;
    }
  },

  getStudentReports: async (studentId) => {
    const response = await api.get(
      `/parent/children/${studentId}/quiz-attempts`
    );
    return response.data;
  },
  
  getQuizHighestScore: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/highest-score`);
      return response.data;
    } catch (error) {
      console.error("Error fetching highest score:", error);
      throw error;
    }
  },

  getQuiz: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}`);
    // console.log("response : ",response.data)
    return response.data;
  },

  getUserQuizAttempts: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/attempts/me`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch quiz attempts"
      );
    }
  },

  getStudentDetailedReport: async (quizId, studentId) => {
    try {
      const response = await api.get(
        `/quizzes/${quizId}/attempts/report?userId=${studentId}`
      );
          console.log("response : ",response)

      return response.data;
    } catch (error) {
      console.error("Error fetching student detailed report:", error);
      throw error;
    }
  },

  getQuizAttemptReport: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/attempts/me/report`);
      return response.data;
    } catch (error) {
      console.error("Error fetching quiz attempt report:", error);
      throw error;
    }
  },
};
export default service;
