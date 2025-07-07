// src/services/taskService.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxied to http://localhost:8080/api via vite.config.js
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token included in request:', token); 
  } else {
    console.warn('No JWT token found in localStorage');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request failed:', {
      url: error.config.url,
      method: error.config.method,
      status: error.response?.status,
      data: error.response?.data || 'No response data',
    });
    return Promise.reject(error);
  }
);

export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;