import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const apiCall = async (method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", url: string, data?: any) => {
    try {
        const response = await apiClient({
            method,
            url,
            data,
        });
        return response.data;
    } catch (error: any) {
        // Do not spam console for expected 401s on /auth/me when checking session
        if (url === "/auth/me" && error.response?.status === 401) {
            throw error;
        }
        console.error(`API Call Error (${method} ${url}):`, error.response?.data || error.message);
        throw error;
    }
};

export const apiUpload = async (url: string, formData: FormData, method: "POST" | "PATCH" = "POST") => {
    try {
        const response = await apiClient({
            method,
            url,
            data: formData,
        });
        return response.data;
    } catch (error: any) {
        console.error(`API Upload Error (${method} ${url}):`, error.response?.data || error.message);
        throw error;
    }
};

export default apiClient;
