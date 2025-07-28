import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/auth`;

const signUpRequestOtp = async (email) => {
    const response = await axios.post(`${API_URL}/signup-request-otp`, { email });
    return response.data;
};

const signUpVerifyOtp = async (email, otp, name, dateOfBirth, password) => {
    const response = await axios.post(`${API_URL}/signup-verify-otp`, { email, otp, name, dateOfBirth, password });
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
    const url = `${API_URL}/login-verify-otp`;
    const payload = { email, otp };

    // --- NEW DEBUGGING LOG ---
    // console.log('authService: Sending loginVerifyOtp request to:', url);
    // console.log('authService: Payload:', payload);
    // --- END NEW DEBUGGING LOG ---

    try {
        const response = await axios.post(url, payload);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('authService: Error during loginVerifyOtp request:', error.message);
        if (error.response) {
            // console.error('authService: Response data:', error.response.data);
            // console.error('authService: Response status:', error.response.status);
            // console.error('authService: Response headers:', error.response.headers);
            throw error.response.data; 
        } else if (error.request) {
            console.error('authService: No response received for loginVerifyOtp:', error.request);
            throw new Error('Network error. Please check your connection.');
        } else {
            console.error('authService: Error setting up loginVerifyOtp request:', error.message);
            throw new Error('An unexpected error occurred.');
        }
    }
};

const forgotPasswordRequestOtp = async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password-request-otp`, { email });
    return response.data;
};

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
    loginRequestOtp,
    loginVerifyOtp, 
    forgotPasswordRequestOtp,
    resetPasswordVerifyOtp,
    logout,
    getCurrentUser,
    getToken,
};

export default authService;
