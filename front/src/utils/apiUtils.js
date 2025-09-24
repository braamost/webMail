import axios from "axios";
import { getUserForTab } from "../SessionManager";

// Base API URL
const API_BASE_URL = "http://localhost:8080";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const user = getUserForTab();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and other errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.error("Authentication failed:", error.response.data);
      localStorage.removeItem('userSessions');
      sessionStorage.clear();
      window.location.href = '/';
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error("Access forbidden:", error.response.data);
      alert("You don't have permission to perform this action.");
    } else if (error.response?.status >= 500) {
      // Server error
      console.error("Server error:", error.response.data);
      alert("Server error. Please try again later.");
    } else if (!error.response) {
      // Network error
      console.error("Network error:", error.message);
      alert("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

// Helper function to create FormData with token
export const createFormDataWithToken = (formData) => {
  const user = getUserForTab();
  if (user && user.token) {
    formData.append('token', user.token);
  }
  return formData;
};

// Helper function for multipart requests with token
export const uploadWithToken = async (url, formData, options = {}) => {
  const user = getUserForTab();
  const headers = {
    ...options.headers,
  };
  
  if (user && user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }
  
  return axios.post(url, formData, {
    ...options,
    headers,
  });
};

export default apiClient;
