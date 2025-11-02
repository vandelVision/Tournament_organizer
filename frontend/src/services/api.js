import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY || '',
    }
});

export const api = {
    loginUser: async (data)=>{
        try {
            const response = await axiosInstance.post("/login", data)
            return response.data
        } catch (error) {
            console.error('Login Error:', error.message);
        }
    },
}
