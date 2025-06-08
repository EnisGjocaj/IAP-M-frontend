import axios from 'axios';

const API_URL = 'http://api.iap-m.com';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type SortBy = 'recent' | 'salaryHighToLow' | 'salaryLowToHigh';

export interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  type: JobType;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  isActive: boolean;
}

export interface GetJobListingsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: JobType | undefined;
  location?: string;
  sortBy?: SortBy;
  includeInactive?: boolean;
  showAll?: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Get all job listings with filters
export const getAllJobListings = async (params: GetJobListingsParams = {}): Promise<PaginatedResponse<JobListing>> => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      type,
      location,
      sortBy,
      includeInactive = false,
      showAll = false,
    } = params;

    console.log('API call params before URL construction:', {
      page,
      limit,
      search,
      type,
      location,
      sortBy,
      includeInactive,
      showAll
    });

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (search) queryParams.append('search', search);
    if (type) queryParams.append('type', type);
    if (location) queryParams.append('location', location);
    if (sortBy) queryParams.append('sortBy', sortBy);
    queryParams.append('includeInactive', includeInactive.toString());
    queryParams.append('showAll', showAll.toString());

    const url = `${API_URL}/job-listings?${queryParams.toString()}`;
    console.log('Making API request to:', url);

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching job listings:', error);
    throw error;
  }
};

// Get a specific job listing
export const getJobListingById = async (id: number): Promise<{ success: boolean; data: JobListing }> => {
  try {
    const response = await axios.get(`${API_URL}/job-listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job listing:', error);
    throw error;
  }
};

// Create a new job listing
export const createJobListing = async (data: Omit<JobListing, 'id' | 'posted' | 'isActive'>): Promise<{ success: boolean; data: JobListing }> => {
  try {
    const response = await axios.post(`${API_URL}/job-listings`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating job listing:', error);
    throw error;
  }
};

// Update a job listing
export const updateJobListing = async (id: number, data: Partial<Omit<JobListing, 'id'>>): Promise<{ success: boolean; data: JobListing }> => {
  try {
    const response = await axios.put(`${API_URL}/job-listings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating job listing:', error);
    throw error;
  }
};

// Delete a job listing
export const deleteJobListing = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.delete(`${API_URL}/job-listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job listing:', error);
    throw error;
  }
};

// Toggle job listing status
export const toggleJobListingStatus = async (id: number): Promise<{ success: boolean; data: JobListing }> => {
  try {
    const response = await axios.patch(`${API_URL}/job-listings/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling job listing status:', error);
    throw error;
  }
};
