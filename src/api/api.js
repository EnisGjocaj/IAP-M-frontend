import config from '../config';
import axios from 'axios';
const axiosInstance = axios.create({ baseURL: config.API_URL });

export const fetcher = (url) =>
  axiosInstance.get(url).then((res) => {
    if (res) {
      return res.data;
    }
    return null;
  });

export const setAuthorizationHeader = (accessToken) => {
  if (accessToken) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
};

export const uploadImage = (formData) =>
  axiosInstance.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export default axiosInstance;
