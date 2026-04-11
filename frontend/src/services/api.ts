// frontend/src/services/api.ts

import axios from 'axios';

// CHANGE: baseURL now relative.
// It will automatically use the domain and port from which the site is loaded.
// For example, if the site is on http://devops-learning-project.ru:8080,
// then the request will go to http://devops-learning-project.ru:8080/api/...
const api = axios.create({
  baseURL: '/api', // <-- THE MOST IMPORTANT CHANGE
});

// Interceptor for JWT tokens remains the same
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Make sure the key matches the one in AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Named export for consistency
export { api };