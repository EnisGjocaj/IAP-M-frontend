import api from "./api";

// Fetch all users
export const getAllUsers = () => api.get('/manageUsers');

// Fetch user by ID
export const getUserById = (id) => api.get(`/manageUsers/${id}`);

// Create user
export const createUser = (values) => api.post('/manageUsers', values);

// Update user
export const updateUser = (id, values) => api.put(`/manageUsers/${id}`, values);

// Delete user
export const deleteUser = (id) => api.delete(`/manageUsers/${id}`);

// Update user

export const getAllStudents = async () => {
  try {
    const response = await api.get('/manageUsers/students');
    return response;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};