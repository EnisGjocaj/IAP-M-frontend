export interface StudentProfile {
  user: {
    id: number;
    name: string;
    email: string;
  };
  university: string;
  faculty: string;
  year: string;
  gpa: number;
  bio: string;
  location: string;
  phoneNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  profileImage: string;
  attendance: number;
  totalCredits: number;
  skills: Array<{
    id: number;
    name: string;
    level: number;
  }>;
  badges: Array<{
    id: number;
    name: string;
    type: string;
    date: string;
  }>;
  trainings: Array<{
    id: number;
    title: string;
    category: string;
    level: string;
    instructor: string;
    hours: number;
    completionDate: string;
    startDate: string;
    status: 'completed' | 'ongoing' | 'upcoming';
    progress: number;
    certificate: boolean;
  }>;
  academicSubjects: Array<{
    id: number;
    name: string;
    grade: string;
    credits: number;
    semester: string;
  }>;
} 