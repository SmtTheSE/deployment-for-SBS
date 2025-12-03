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
    name: 'John Doe'
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
  },
  {
    id: 3,
    code: 'ENG101',
    name: 'English Composition',
    credits: 3,
    department: 'English'
  },
  {
    id: 4,
    code: 'PHYS201',
    name: 'General Physics I',
    credits: 4,
    department: 'Physics'
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

// Mock study plan data
export const mockStudyPlans = [
  {
    id: 1,
    studentId: 'S001',
    courseId: 1,
    courseName: 'Introduction to Computer Science',
    year: 1,
    sem: 1,
    status: 1 // completed
  },
  {
    id: 2,
    studentId: 'S001',
    courseId: 2,
    courseName: 'Calculus II',
    year: 1,
    sem: 1,
    status: 1 // completed
  },
  {
    id: 3,
    studentId: 'S001',
    courseId: 3,
    courseName: 'English Composition',
    year: 1,
    sem: 2,
    status: 0 // in progress
  },
  {
    id: 4,
    studentId: 'S001',
    courseId: 4,
    courseName: 'General Physics I',
    year: 1,
    sem: 2,
    status: 0 // in progress
  }
];

// Mock transcript data
export const mockTranscripts = [
  {
    semester: 'SEM_2024_1',
    courses: [
      {
        course: 'CS101',
        course_name: 'Introduction to Computer Science',
        grade: 'A (Excellent)'
      },
      {
        course: 'MATH201',
        course_name: 'Calculus II',
        grade: 'B+ (Good)'
      }
    ]
  },
  {
    semester: 'SEM_2024_2',
    courses: [
      {
        course: 'ENG101',
        course_name: 'English Composition',
        grade: 'A- (Very Good)'
      },
      {
        course: 'PHYS201',
        course_name: 'General Physics I',
        grade: 'B (Good)'
      }
    ]
  }
];

// Mock attendance data
export const mockAttendanceLogs = [
  {
    date: '2025-01-15',
    checkIn: '09:00',
    checkOut: '11:00',
    status: 1, // present
    note: '',
    courseName: 'Introduction to Computer Science'
  },
  {
    date: '2025-01-16',
    checkIn: '14:00',
    checkOut: '16:00',
    status: 1, // present
    note: '',
    courseName: 'Calculus II'
  },
  {
    date: '2025-01-17',
    checkIn: '',
    checkOut: '',
    status: 0, // absent
    note: 'Sick leave',
    courseName: 'English Composition'
  }
];

// Mock class schedules
export const mockClassSchedules = [
  {
    classScheduleId: 1,
    classDate: '2025-02-01',
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '11:00',
    durationMinutes: 120,
    room: 'Room 101',
    courseName: 'Introduction to Computer Science',
    lecturerName: 'Dr. Smith'
  },
  {
    classScheduleId: 2,
    classDate: '2025-02-03',
    dayOfWeek: 'WEDNESDAY',
    startTime: '14:00',
    endTime: '16:00',
    durationMinutes: 120,
    room: 'Room 205',
    courseName: 'Calculus II',
    lecturerName: 'Prof. Johnson'
  },
  {
    classScheduleId: 3,
    classDate: '2025-02-05',
    dayOfWeek: 'FRIDAY',
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    room: 'Room 301',
    courseName: 'English Composition',
    lecturerName: 'Dr. Williams'
  }
];

// Mock attendance summary
export const mockAttendanceSummary = {
  totalClasses: 30,
  attendedClasses: 25,
  attendanceRate: 83.33
};

// Add more mock data as needed for other entities