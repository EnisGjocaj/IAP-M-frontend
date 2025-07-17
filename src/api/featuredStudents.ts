import api from "./api";
import { setAuthorizationHeader } from "./api";

interface TrainingReview {
  id: number;
  content: string;
  rating: number;
  training: {
    title: string;
    category: string;
    level: string;
  };
}

interface FeaturedStudentData {
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  courseType: 'INFORMATION_SCIENCE' | 'AGROBUSINESS' | 'ACCOUNTING' | 'MARKETING';
  score: number;
  imagePath?: string;
  description: string;
  achievements: string[];
  graduationDate: Date;
  linkedinUrl?: string;
  testimonial?: string;
  isActive?: boolean;
  cvPath?: string;  
  studentProfileId?: number;
  trainingReviews?: TrainingReview[];
}

export const getAllFeaturedStudents = async () => {
  try {
    // Get auth token if it exists
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');
    const token = user?.token;

    // Make the request with auth header if token exists
    const response = await api.get('/featured-students', {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    
    console.log('Raw API response:', response); // Add this debug log
    
    // Ensure we're always returning the data in the same format
    const students = Array.isArray(response.data) ? response.data : 
                    Array.isArray(response.data.message) ? response.data.message : 
                    [];
    
    console.log('Processed students data:', students);
    
    return {
      data: students
    };
  } catch (error) {
    console.error('Error fetching featured students:', error);
    throw error;
  }
};
export const getFeaturedStudentById = async (id: number) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');
    const token = user?.token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.get(`/featured-students/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('API Response:', response); 
    return response;
  } catch (error) {
    console.error('Error in getFeaturedStudentById:', error);
    throw error;
  }
};

// Create featured student with image upload
export const createFeaturedStudent = async (formData: FormData) => {
  const userStr = localStorage.getItem('user');
  const user = JSON.parse(userStr || '{}');
  const token = user?.token;

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    console.log('FormData before API call:');
    Array.from(formData.entries()).forEach(pair => {
      console.log(pair[0], pair[1]);
    });

    const response = await api.post('/featured-students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('API Response:', response.data);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Update featured student with possible image upload
export const updateFeaturedStudent = async (id: number, formData: FormData) => {
  // Get the token directly from localStorage
  const userStr = localStorage.getItem('user');
  const user = JSON.parse(userStr || '{}');
  const token = user?.token;

  if (!token) {
    throw new Error('Authentication required');
  }

  return await api.put(`/featured-students/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    },
  });
};

// Delete featured student
export const deleteFeaturedStudent = async (id: number) => {
  try {
    // Get auth token
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');
    const token = user?.token;

    if (!token) {
      throw new Error('Authentication required');
    }

    // Make the request with auth header
    const response = await api.delete(`/featured-students/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Delete response:', response);
    return response;
  } catch (error) {
    console.error('Error deleting featured student:', error);
    throw error;
  }
};

// Get featured students by course type
export const getFeaturedStudentsByCourse = (courseType: string) => 
  api.get(`/featured-students/course/${courseType}`);

// Get top performing students
export const getTopPerformingStudents = (limit?: number) => 
  api.get(`/featured-students/top${limit ? `/${limit}` : ''}`);

// Helper function to create FormData from student data
export const createFeaturedStudentFormData = (data: FeaturedStudentData, image?: File): FormData => {
  const formData = new FormData();

  // Add all text fields
  formData.append('name', data.name);
  formData.append('surname', data.surname);
  formData.append('email', data.email);
  if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
  formData.append('courseType', data.courseType);
  formData.append('score', data.score.toString());
  formData.append('description', data.description);
  formData.append('achievements', JSON.stringify(data.achievements));
  formData.append('graduationDate', new Date(data.graduationDate).toISOString());
  if (data.linkedinUrl) formData.append('linkedinUrl', data.linkedinUrl);
  if (data.testimonial) formData.append('testimonial', data.testimonial);
  if (typeof data.isActive === 'boolean') formData.append('isActive', data.isActive.toString());

  // Add image if provided
  if (image) {
    formData.append('image', image);
  }

  return formData;
};

// Example usage of the API:
/*
// Get all students
const fetchStudents = async () => {
  try {
    const response = await getAllFeaturedStudents();
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// Create a new featured student
const createNewStudent = async (studentData: FeaturedStudentData, image?: File) => {
  try {
    const formData = createFeaturedStudentFormData(studentData, image);
    const response = await createFeaturedStudent(formData);
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

// Update a student
const updateStudent = async (id: number, studentData: FeaturedStudentData, image?: File) => {
  try {
    const formData = createFeaturedStudentFormData(studentData, image);
    const response = await updateFeaturedStudent(id, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

// Get top performers
const getTopStudents = async (limit: number = 5) => {
  try {
    const response = await getTopPerformingStudents(limit);
    return response.data;
  } catch (error) {
    console.error('Error fetching top students:', error);
    throw error;
  }
};
*/ 

export const getStudentCV = async (id: number) => {
  try {
    const response = await api.get(`/featured-students/${id}/cv`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student CV:', error);
    throw error;
  }
}; 