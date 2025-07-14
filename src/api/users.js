import api from './api';

// Register
export const registerUser = async (values) => {
  try {
    const response = await api.post('/users/register', values);
    return response;
  } catch (error) {
    throw error;
  }
};

// Login
export const loginUser = async (values) => {
  try {
    const response = await api.post('/users/login', values);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const response = await api.get('/users/students');
    return response;
  } catch (error) {
    throw error;
  }
};
