import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getAllUsers = () => api.get('/admin/users');
export const getPendingUsers = () => api.get('/admin/pending-users');
export const approveUser = (id) => api.post(`/admin/approve/${id}`);
export const deleteUser = (id) => api.delete(`/admin/user/${id}`);
export const getAllTasks = () => api.get('/admin/tasks');

export default api;