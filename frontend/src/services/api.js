import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY || '',
    },
    withCredentials: true,
});

export const api = {
    loginPlayer: async (data)=>{
        try {
            const response = await apiClient.post("/login", data)
            console.log("Login Response:", response);
            return response.data
        } catch (error) {
            console.error('Login Error:', error.message);
        }
    },
    signupPlayer: async (data)=>{
        try {
            const response = await apiClient.post("/signup", data)
            return response.data
        } catch (error) {
            console.error('Login Error:', error.message);
        }
    },
    checkAuth: async ()=>{
        try {
            const response = await apiClient.get("/auth-verify")
            return response.data
        } catch (error) {
            console.error('Auth Check Error:', error.message);
        }
    },
    logoutPlayer: async ()=>{
        try {
            const response = await apiClient.post("/logout")
            return response.data
        } catch (error) {
            console.error('Logout Error:', error.message);
        }
    },
}
