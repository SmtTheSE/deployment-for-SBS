// src/api/axios.js
import axios from 'axios';
import { MockApiService, mockLogin } from './mockApi';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

let useMock = false;

// Check if we should use mock data (for Vercel deployment)
if (import.meta.env.MODE === 'production') {
  // In production (like Vercel), we might want to use mock data
  // You can also set this based on an environment variable
  useMock = import.meta.env.VITE_USE_MOCK === 'true';
}

// Check if we're running on Vercel
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  useMock = true;
}

axiosInstance.interceptors.request.use(config => {
  // If using mock, intercept requests and handle them with mock data
  if (useMock) {
    console.log('Using mock API for request:', config);
  }

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle mock responses or fallback
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;
    
    // If we get a network error and we're not already using mock, try mock fallback
    if (!useMock && (error.code === 'NETWORK_ERROR' || !error.response)) {
      console.log('Network error detected, falling back to mock data');
      
      try {
        let result;
        switch (config.method.toLowerCase()) {
          case 'get':
            result = await MockApiService.get(config.url);
            break;
          case 'post':
            result = await MockApiService.post(config.url, config.data);
            break;
          case 'put':
            result = await MockApiService.put(config.url, config.data);
            break;
          case 'delete':
            result = await MockApiService.delete(config.url);
            break;
          default:
            throw new Error('Unsupported method');
        }
        
        return Promise.resolve({ data: result, status: 200 });
      } catch (mockError) {
        return Promise.reject(mockError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Export mock login function separately
export { mockLogin };

export default axiosInstance;