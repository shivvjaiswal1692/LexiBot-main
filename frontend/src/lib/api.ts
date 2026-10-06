import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lexibot_token');
      localStorage.removeItem('lexibot_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
