import axios from 'axios';

export const login = (credentials) => axios.post('/api/auth/login', credentials);
export const register = (userData) => axios.post('/api/auth/register', userData);