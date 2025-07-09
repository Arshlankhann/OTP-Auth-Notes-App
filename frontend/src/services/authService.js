
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/auth`;

const signUpRequestOtp = async (email) => {
    const response = await axios.post(`${API_URL}/signup-request-otp`, { email });
    return response.data;
};

const signUpVerifyOtp = async (email, otp, name, dateOfBirth) => {
    const response = await axios.post(`${API_URL}/signup-verify-otp`, { email, otp, name, dateOfBirth });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const loginRequestOtp = async (email) => {
    const response = await axios.post(`${API_URL}/login-request-otp`, { email });
    return response.data;
};

const loginVerifyOtp = async (email, otp) => {
    const response = await axios.post(`${API_URL}/login-verify-otp`, { email, otp });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
    }
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
    loginRequestOtp,
    loginVerifyOtp,
    logout,
    getCurrentUser,
    getToken,
};

export default authService;
