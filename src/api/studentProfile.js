import api from './api';

// Helper to get auth token - Updated version
const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  const user = JSON.parse(userStr || '{}');
  const token = user?.token;

  if (!token) {
    throw new Error('Authentication required');
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  };
};

// Get student profile - Updated with better error handling and token
export const getStudentProfile = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const config = getAuthHeaders();
    console.log('Making request with config:', config); 

    const response = await api.get(`/student-profile/${userId}`, config);
    console.log('Student Profile API Response:', response); 
    return response;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    if (error.response?.status === 401) {
      console.error('Authentication token is invalid or expired');
    }
    throw error;
  }
};

// Update student profile - Updated with better token handling
export const updateStudentProfile = async (userId, data) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const config = {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        ...(data instanceof FormData 
          ? {}
          : { 'Content-Type': 'application/json' }
        )
      }
    };

    return await api.put(`/student-profile/${userId}`, data, config);
  } catch (error) {
    console.error('Error updating student profile:', error);
    throw error;
  }
};

// Skills management - Updated with direct token handling
export const addSkill = async (userId, data) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');
    const token = user?.token;

    if (!token) {
      throw new Error('Authentication required');
    }

    return await api.post(
      `/student-profile/${userId}/skills`, 
      data, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

// Badges management - Updated with direct token handling
export const addBadge = async (userId, data) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');
    const token = user?.token;

    if (!token) {
      throw new Error('Authentication required');
    }

    return await api.post(
      `/student-profile/${userId}/badges`, 
      data, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error adding badge:', error);
    throw error;
  }
};

// Training management - Updated with direct token handling
export const addTraining = async (userId, data) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');
    const token = user?.token;

    if (!token) {
      throw new Error('Authentication required');
    }

    return await api.post(
      `/student-profile/${userId}/trainings`, 
      data, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error adding training:', error);
    throw error;
  }
};

// Academic subjects management - Updated with direct token handling
export const addAcademicSubject = async (userId, data) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');
    const token = user?.token;

    if (!token) {
      throw new Error('Authentication required');
    }

    return await api.post(
      `/student-profile/${userId}/subjects`, 
      data, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error adding subject:', error);
    throw error;
  }
};

// Add this new function
export const getAllStudentProfiles = async () => {
  try {
    const config = getAuthHeaders();
    const response = await api.get('/student-profile', config);
    return response;
  } catch (error) {
    console.error('Error fetching all student profiles:', error);
    throw error;
  }
};