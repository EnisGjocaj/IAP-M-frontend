import api from "./api";

// Fetch all news
export const getAllNews = () => api.get('/api/news');

// Fetch news by ID
export const getNewsById = (id) => api.get(`/api/news/${id}`, {
  params: {
    include_images: true 
  }
});

// Create news
export const createNews = (values) => api.post('/api/news', values);

// Update news
export const updateNews = (id, values) => api.put(`/api/news/${id}`, values);

// Delete news
export const deleteNews = (id) => api.delete(`/api/news/${id}`);
