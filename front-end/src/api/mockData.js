// Mock data for fallback when backend is not available
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@sbs.edu',
    role: 'ADMIN',
    name: 'Admin User'
  },
  {
    id: 2,
    username: 'student',
    email: 'student@sbs.edu',
    role: 'STUDENT',
    name: 'Student User'
  },
  {
    id: 3,
    username: 'lecturer',
    email: 'lecturer@sbs.edu',
    role: 'LECTURER',
    name: 'Lecturer User'
  }
];

export const mockCourses = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Computer Science',
    credits: 3,
    department: 'Computer Science'
  },
  {
    id: 2,
    code: 'MATH201',
    name: 'Calculus II',
    credits: 4,
    department: 'Mathematics'
  }
];

export const mockStudents = [
  {
    id: 1,
    studentId: 'S001',
    name: 'John Doe',
    email: 'johndoe@sbs.edu',
    program: 'Computer Science',
    enrollmentYear: 2022
  },
  {
    id: 2,
    studentId: 'S002',
    name: 'Jane Smith',
    email: 'janesmith@sbs.edu',
    program: 'Business Administration',
    enrollmentYear: 2021
  }
];

export const mockAnnouncements = [
  {
    id: 1,
    title: 'Welcome to SBS Student Portal',
    content: 'This is a sample announcement for students.',
    date: '2025-01-15',
    author: 'Admin'
  },
  {
    id: 2,
    title: 'Important Exam Schedule Update',
    content: 'Please note that the exam schedule has been updated. Check your course pages for details.',
    date: '2025-01-20',
    author: 'Exam Office'
  }
];

// Add more mock data as needed for other entities