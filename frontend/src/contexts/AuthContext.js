// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => { // New password-based login
        const data = await authService.login(email, password);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Modified handleSignUp to correctly receive and pass the password
    const handleSignUp = async (email, otp, name, dateOfBirth, password) => {
        // Ensure password is explicitly passed to the service
        const data = await authService.signUpVerifyOtp(email, otp, name, dateOfBirth, password);
        setUser(data.user);
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, handleSignUp, authService }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
