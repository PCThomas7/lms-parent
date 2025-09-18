import { api } from "./api";

const authService = {
  
  login: async (email, password , pushToken) => {
    const response = await api.post("/auth/login", { email, password ,pushToken });
    return response.data;
  },

  register: async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return response;
    } catch (error) {
      console.log("error : ", error);
    }
  },

  googleLogin: async (userInfo) => {
    try {
      const response = await api.post(`/auth/google`, { userInfo });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
};

export default authService;
