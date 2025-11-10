import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_APP_API_KEY || "",
  },
  withCredentials: true,
});

export const api = {
  loginPlayer: async (data) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  signupPlayer: async (data) => {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  },

  checkAuth: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  logoutPlayer: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  signupHost: async (data) => {
    const response = await apiClient.post("/auth/host_signup", data);
    return response.data;
  },

  loginHost: async (data) => {
    const response = await apiClient.post("/auth/host_login", data);
    return response.data;
  },
  // Resend verification email for current authenticated user
  resendVerification: async () => {
    const response = await apiClient.post("/auth/generate_otp", data);
    return response.data;
  },
};
