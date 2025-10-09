import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.token) {
                setUser(storedUser);
                if (storedUser.isTemporaryPassword) {
                    setShowPasswordModal(true);
                }
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/signin', { email, password });
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        if (userData.isTemporaryPassword) {
            setShowPasswordModal(true);
        }
    };

    const signup = async (signupData) => {
        return await api.post('/auth/signup', signupData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setShowPasswordModal(false);
    };
    
    const updateUserContext = (updatedUserInfo) => {
        setUser(currentUser => {
            const newUser = { ...currentUser, ...updatedUserInfo };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    };

    const value = { user, isAuthenticated: !!user, loading, login, signup, logout, updateUserContext, showPasswordModal, setShowPasswordModal };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}