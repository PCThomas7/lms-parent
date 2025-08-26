import { api } from "./api";

const authService = {

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register:async (name,email,password) => {
    try {
      const response = await api.post('/auth/registet',{
        name,
        email,
        password
      })
      return response;
    } catch (error) {
      console.log("error : ",error)
    }
  }
  
};

export default authService;