// Unified API client that handles both real and mock APIs
import axios from './axios';
import { MockApiService } from './mockApi';

class ApiClient {
  constructor() {
    // Detect if we should use mock data
    this.useMock = this.shouldUseMock();
  }

  shouldUseMock() {
    // Check various conditions for using mock data
    return (
      import.meta.env.VITE_USE_MOCK === 'true' ||
      (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) ||
      import.meta.env.MODE === 'development' && import.meta.env.VITE_FORCE_MOCK === 'true'
    );
  }

  async get(endpoint, config = {}) {
    if (this.useMock) {
      try {
        const data = await MockApiService.get(endpoint);
        return { data, status: 200, statusText: 'OK' };
      } catch (error) {
        throw error;
      }
    }

    try {
      return await axios.get(endpoint, config);
    } catch (error) {
      throw error;
    }
  }

  async post(endpoint, data, config = {}) {
    if (this.useMock) {
      try {
        const result = await MockApiService.post(endpoint, data);
        return { data: result, status: 200, statusText: 'OK' };
      } catch (error) {
        throw error;
      }
    }

    try {
      return await axios.post(endpoint, data, config);
    } catch (error) {
      throw error;
    }
  }

  async put(endpoint, data, config = {}) {
    if (this.useMock) {
      try {
        const result = await MockApiService.put(endpoint, data);
        return { data: result, status: 200, statusText: 'OK' };
      } catch (error) {
        throw error;
      }
    }

    try {
      return await axios.put(endpoint, data, config);
    } catch (error) {
      throw error;
    }
  }

  async delete(endpoint, config = {}) {
    if (this.useMock) {
      try {
        const result = await MockApiService.delete(endpoint);
        return { data: result, status: 200, statusText: 'OK' };
      } catch (error) {
        throw error;
      }
    }

    try {
      return await axios.delete(endpoint, config);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();
export default apiClient;