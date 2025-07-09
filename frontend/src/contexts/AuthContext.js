
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

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const handleSignUp = async (email, otp, name, dateOfBirth) => {
        const data = await authService.signUpVerifyOtp(email, otp, name, dateOfBirth);
        setUser(data.user);
        return data;
    };

    const handleLogin = async (email, otp) => {
        const data = await authService.loginVerifyOtp(email, otp);
        setUser(data.user);
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, handleSignUp, handleLogin, authService }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
