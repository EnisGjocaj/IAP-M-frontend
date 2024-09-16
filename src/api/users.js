import api from './api';

// Register
export const registerUser = (values) => api.post('/users/register', values);

// Login
export const loginUser = (values) => api.post('/users/login', values);
