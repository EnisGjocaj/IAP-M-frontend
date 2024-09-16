import api from "./api";

// Fetch all news
export const getAllNews = () => api.get('/news');

// Fetch news by ID
export const getNewsById = (id) => api.get(`/news/${id}`);

// Create news
export const createNews = (values) => api.post('/news', values);

// Update news
export const updateNews = (id, values) => api.put(`/news/${id}`, values);

// Delete news
export const deleteNews = (id) => api.delete(`/news/${id}`);
