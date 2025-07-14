import api from './api';

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
      'Content-Type': 'application/json'
    }
  };
};

// Get all trainings
export const getAllTrainings = async () => {
  try {
    const response = await api.get('/training-programs-iap', getAuthHeaders());
    
    return {
      data: {
        message: response.data.message || [], 
        statusCode: response.data.statusCode
      }
    };
  } catch (error) {
    console.error('Error fetching trainings:', error);
    throw error;
  }
};

// Get single training
export const getTraining = async (id) => {
  try {
    console.log('Making API call for training:', id);
    const response = await api.get(`/training-programs-iap/${id}`, getAuthHeaders());
    console.log('API Response:', response);
    
    return response.data?.message || response.data;
  } catch (error) {
    console.error('Error fetching training:', error);
    throw error;
  }
};

// Create training
export const createTraining = async (data) => {
  try {
    const response = await api.post('/training-programs-iap', data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating training:', error);
    throw error;
  }
};

// Update training
export const updateTraining = async (id, data) => {
  try {
    const response = await api.put(`/training-programs-iap/${id}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating training:', error);
    throw error;
  }
};

// Delete training
export const deleteTraining = async (id) => {
  try {
    const response = await api.delete(`/training-programs-iap/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error deleting training:', error);
    throw error;
  }
};

// Enroll student in training
export const enrollStudent = async (trainingId, profileId) => {
  try {
    const response = await api.post(
      `/training-programs-iap/${trainingId}/enroll/${profileId}`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw error;
  }
};

// Update enrollment status
export const updateEnrollmentStatus = async (trainingId, profileId, data) => {
  try {
    const response = await api.put(
      `/training-programs-iap/${trainingId}/enrollment/${profileId}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    throw error;
  }
};

// Get all enrollments for a 
export const getTrainingEnrollments = async (trainingId) => {
  try {
    const response = await api.get(
      `/training-programs-iap/${trainingId}/enrollments`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching training enrollments:', error);
    throw error;
  }
}; 

export const getStudentTrainingReviews = async (studentProfileId) => {
  try {
    const response = await api.get(
      `/training-programs-iap/reviews/student/${studentProfileId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching student training reviews:', error);
    throw error;
  }
}; 