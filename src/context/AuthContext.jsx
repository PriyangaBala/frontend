import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse stored user:', e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials);
            const { token, role, username } = response.data;
            localStorage.setItem('token', token);
            // localStorage.setItem('user', JSON.stringify({ username, role }));
            setUser({ username, role });
            // Redirect based on role
            navigate(role === 'ROLE_ADMIN' ? '/admin' : '/tasks');
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data || 'Login failed. Please check your credentials.');
        }
    };

    const handleRegister = async (userData) => {
        try {
            await register(userData);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, handleLogin, handleRegister, logout }}>
            {children}
        </AuthContext.Provider>
    );
};