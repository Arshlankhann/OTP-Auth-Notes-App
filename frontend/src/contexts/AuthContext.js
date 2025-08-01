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

    const login = async (email, otp) => { 
        console.log('AuthContext: login function entered.'); 
        const data = await authService.loginVerifyOtp(email, otp); 
        setUser(data.user);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const handleSignUp = async (email, otp, name, dateOfBirth, password) => {
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
