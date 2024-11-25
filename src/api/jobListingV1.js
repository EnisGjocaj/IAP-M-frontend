import axios from 'axios';

const API_URL = 'http://localhost:4000';

// Get all job listings with filters
export const getAllJobListings = async ({
  page = 1,
  limit = 10,
  searchTerm = '',
  type,
  location,
  sortBy,
} = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (searchTerm) params.append('search', searchTerm);
    if (type && type !== 'all') params.append('type', type);
    if (location && location !== 'all') params.append('location', location);
    if (sortBy) params.append('sortBy', sortBy);

    const response = await axios.get(`${API_URL}/job-listings?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job listings:', error);
    throw error;
  }
};

// Get a specific job listing
export const getJobListingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/job-listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job listing:', error);
    throw error;
  }
};

// Create a new job listing
export const createJobListing = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/job-listings`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating job listing:', error);
    throw error;
  }
};

// Update a job listing
export const updateJobListing = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/job-listings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating job listing:', error);
    throw error;
  }
};

// Delete a job listing
export const deleteJobListing = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/job-listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job listing:', error);
    throw error;
  }
};

// Toggle job listing status
export const toggleJobListingStatus = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/job-listings/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling job listing status:', error);
    throw error;
  }
};
