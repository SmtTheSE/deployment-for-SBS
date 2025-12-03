import axios from 'axios';
import { mockLogin, MockApiService } from '../api/mockApi';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to determine if we should use mock data
let useMock = false;

// Check if we should use mock data
if (import.meta.env.MODE === 'production') {
  useMock = import.meta.env.VITE_USE_MOCK === 'true';
}

// Also check if we're on Vercel
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  useMock = true;
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // If using mock mode, just return the config with a mock flag
    if (useMock) {
      config.isMock = true;
    }

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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config } = error;
    
    // If it's a mock request, skip
    if (config.isMock) {
      return Promise.reject(error);
    }
    
    // For network errors, try to fallback to mock data
    if (!error.response && useMock) {
      try {
        let result;
        switch (config.method?.toLowerCase()) {
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
            throw new Error('Method not supported');
        }
        
        return Promise.resolve({
          data: result,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
      } catch (mockError) {
        return Promise.reject(mockError);
      }
    }
    
    return Promise.reject(error);
  }
);

export { mockLogin };
export default axiosInstance;