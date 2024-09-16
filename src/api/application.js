import api  from './api';

// Fetch all applications
export const getAllApplications = () => api.get('/applications');

// Fetch application by ID
export const getApplicationById = (id) => api.get(`/applications/${id}`);

// Create application
export const createApplication = (values) => api.post('/applications', values);

// Update application
export const updateApplication = (id, values) => api.put(`/applications/${id}`, values);

// Delete application
export const deleteApplication = (id) => api.delete(`/applications/${id}`);
