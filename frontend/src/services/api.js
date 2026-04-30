import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://pl-de-dupe.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show toast notification
      toast.error('Session expired. Please login again.');
      
      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      
      return Promise.reject(error);
    }
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || 'An error occurred';
    if (errorMessage && !originalRequest._skipErrorToast) {
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
  getUserStats: () => api.get('/auth/stats')
};

export const dedupeAPI = {
  process: (formData) => api.post('/dedupe/process', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000 // 60 seconds for file upload
  }),
  download: (historyId, format) => api.get(`/dedupe/download/${historyId}/${format}`, {
    responseType: 'blob',
    _skipErrorToast: true
  }),
  getHistory: (params) => api.get('/dedupe/history', { params }),
  getHistoryById: (id) => api.get(`/dedupe/history/${id}`),
  getStatistics: () => api.get('/dedupe/statistics'),
  deleteHistory: (id) => api.delete(`/dedupe/history/${id}`),
  getInsights: () => api.get('/dedupe/insights')
};

// File download utility
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default api;
