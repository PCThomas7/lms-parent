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
  
};
export default service;
