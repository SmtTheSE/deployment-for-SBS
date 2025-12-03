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
    
    // For student-related endpoints
    if (endpoint.includes('/api/profile')) {
      // Return student profile data
      return mockData.mockStudents[0]; // John Doe as default student
    }
    
    if (endpoint.includes('/api/academic/study-plan-courses/student')) {
      // Return study plan for student
      return mockData.mockStudyPlans;
    }
    
    if (endpoint.includes('/api/academic/course-results/student')) {
      // Return course results for student
      return []; // Empty for now
    }
    
    if (endpoint.includes('/api/academic/course-results/total-credits')) {
      // Return total credits
      return 14; // Sample total credits
    }
    
    if (endpoint.includes('/api/academic/class-timelines')) {
      // Return class schedules
      return mockData.mockClassSchedules;
    }
    
    if (endpoint.includes('/api/academic/daily-attendance/student')) {
      // Return attendance logs
      return mockData.mockAttendanceLogs;
    }
    
    if (endpoint.includes('/api/academic/daily-attendance/summary/student')) {
      // Return attendance summary
      return mockData.mockAttendanceSummary;
    }
    
    if (endpoint.includes('/api/academic/grades')) {
      // Return grade information
      return [
        { gradeName: 'A', description: 'Excellent' },
        { gradeName: 'B+', description: 'Good' },
        { gradeName: 'B', description: 'Good' },
        { gradeName: 'A-', description: 'Very Good' }
      ];
    }
    
    // General endpoints
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