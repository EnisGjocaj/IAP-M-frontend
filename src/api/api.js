import config from '../config';
import axios from 'axios';
const axiosInstance = axios.create({ baseURL: config.API_URL });

axiosInstance.interceptors.request.use(
  (requestConfig) => {
    try {
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr || '{}');
      const token = user?.token;

      if (typeof token === 'string' && token.trim().length > 0) {
        const headers = requestConfig.headers || {};
        const existing = headers.Authorization || headers.authorization;
        if (!existing) {
          headers.Authorization = `Bearer ${token}`;
          requestConfig.headers = headers;
        }
      }
    } catch {
      // ignore
    }

    return requestConfig;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const reqUrl = error?.config?.url || '';
    const path = window.location?.pathname || '';

    const isAiApiRequest = typeof reqUrl === 'string' && reqUrl.includes('/api/ai');
    const hasUiMessage = Boolean(error?.response?.data?.uiMessage);

    // IMPORTANT:
    // - 401 means auth is invalid/expired: clear user and optionally redirect.
    // - 403 can be a business-rule block (e.g. AI disabled) and must NOT log the user out.
    if (status === 401) {
      try {
        localStorage.removeItem('user');
      } catch {
        // ignore
      }

      if (path.startsWith('/ai') || path.startsWith('/dashboard')) {
        window.location.href = '/';
      }
    }

    if (status === 403) {
      // If AI is disabled, backend returns a 403 with a UI message. Let the UI show the modal.
      if (isAiApiRequest && hasUiMessage) {
        return Promise.reject(error);
      }

      if (path.startsWith('/dashboard')) {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

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
