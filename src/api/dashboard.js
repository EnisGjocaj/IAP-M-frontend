// src/api/dashboard.js
import api from './api';

// Fetch dashboard statistics
export const getStatistics = () => api.get('/dashboard/statistics');

// Fetch training applications
export const getTrainingApplications = () => api.get('/dashboard/training-applications');
