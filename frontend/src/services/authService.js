// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/auth`;

const signUpRequestOtp = async (email) => {
    const response = await axios.post(`${API_URL}/signup-request-otp`, { email });
    return response.data;
};

// Modified to include name, dateOfBirth, and password
const signUpVerifyOtp = async (email, otp, name, dateOfBirth, password) => {
    const response = await axios.post(`${API_URL}/signup-verify-otp`, { email, otp, name, dateOfBirth, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// New login function (password-based)
const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// New: Request OTP for forgot password
const forgotPasswordRequestOtp = async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password-request-otp`, { email });
    return response.data;
};

// New: Verify OTP and reset password
const resetPasswordVerifyOtp = async (email, otp, newPassword) => {
    const response = await axios.post(`${API_URL}/reset-password-verify-otp`, { email, otp, newPassword });
    return response.data;
};


const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const getToken = () => {
    return localStorage.getItem('token');
};

const authService = {
    signUpRequestOtp,
    signUpVerifyOtp,
    login, // Export the new login function
    forgotPasswordRequestOtp, // Export new password reset request
    resetPasswordVerifyOtp,   // Export new password reset verification
    logout,
    getCurrentUser,
    getToken,
};

export default authService;
