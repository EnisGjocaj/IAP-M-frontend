import api from "./api";

// Fetch all team members
export const getAllTeamMembers = () => api.get('/team-members');

// Fetch team member by ID
export const getTeamMemberById = (id) => api.get(`/team-members/${id}`);

// Create team member
export const createTeamMember = (values) => api.post('/team-members', values);

// Update team member
export const updateTeamMember = (id, values) => api.put(`/team-members/${id}`, values);

// Delete team member
export const deleteTeamMember = (id) => api.delete(`/team-members/${id}`);

