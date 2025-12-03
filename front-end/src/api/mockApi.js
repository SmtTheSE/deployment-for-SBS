// Mock API service that mimics backend endpoints
import * as mockData from './mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication
export const mockLogin = async (username, password) => {
  await delay(500); // Simulate network delay
  
  // Simple validation
  const user = mockData.mockUsers.find(u => u.username === username);
  if (user && password) { // In a real app, you'd check the password hash
    return {
      user,
      token: 'mock-jwt-token-for-' + username
    };
  }
  
  throw new Error('Invalid credentials');
};

// Mock API functions for various endpoints
export const mockGetCourses = async () => {
  await delay(300);
  return mockData.mockCourses;
};

export const mockGetStudents = async () => {
  await delay(300);
  return mockData.mockStudents;
};

export const mockGetAnnouncements = async () => {
  await delay(300);
  return mockData.mockAnnouncements;
};

// Generic mock API handler
export class MockApiService {
  static async get(endpoint) {
    await delay(300);
    
    switch (endpoint) {
      case '/api/courses':
        return mockData.mockCourses;
      case '/api/students':
        return mockData.mockStudents;
      case '/api/announcements':
        return mockData.mockAnnouncements;
      case '/api/users/me':
        return mockData.mockUsers[0]; // Return first user as "current user"
      default:
        return [];
    }
  }
  
  static async post(endpoint, data) {
    await delay(500);
    // In a real mock, you might save data here
    return { success: true, data };
  }
  
  static async put(endpoint, data) {
    await delay(500);
    return { success: true, data };
  }
  
  static async delete(endpoint) {
    await delay(300);
    return { success: true };
  }
}