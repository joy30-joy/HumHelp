import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // make sure this matches your Vite proxy setup
});

// Always add JWT if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
