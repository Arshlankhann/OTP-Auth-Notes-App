import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff icons
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import Image from './rightimg.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('request-otp');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [otpVisible, setOtpVisible] = useState(false);

    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const data = await authService.loginRequestOtp(email);
            setSuccessMessage(data.message);
            setStep('verify-otp');
            toast.success(data.message);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            await handleLogin(email, otp);
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'OTP verification failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleOtpVisibility = () => {
        setOtpVisible(!otpVisible);
    };

    return (
        <div className="container">
            <div className="form-section">
                <div className="logo">
                    <div className="logo-icon"></div>
                    <span className="logo-text">HD</span>
                </div>

                <h1 className="form-title">Sign In</h1>
                <p className="form-subtitle">Please login to continue to your account</p>

                {error && <div className="message error-message">{error}</div>}
                {successMessage && <div className="message success-message">{successMessage}</div>}

                <form onSubmit={step === 'request-otp' ? handleRequestOtp : handleVerifyOtp}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            disabled={step === 'verify-otp'}
                        />
                        <div className='space'></div>
                        <label className="form-label">OTP</label>
                        <div className="otp-group">
                            <input
                                type={otpVisible ? 'text' : 'password'}
                                className="form-input otp-input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                maxLength="6"
                            />
                            <button
                                type="button"
                                className="otp-toggle"
                                onClick={toggleOtpVisibility}
                            >
                                {otpVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                    </div>


                    <button type="submit" className="signup-btn" disabled={loading}>
                        {step === 'request-otp'
                            ? loading
                                ? 'Sending OTP...'
                                : 'Get OTP'
                            : loading
                                ? 'Signing In...'
                                : 'Sign In'}
                    </button>

                    {step === 'verify-otp' && (
                        <div className="signin-link" style={{ textAlign: 'center', marginTop: '20px' }}>
                            <a href="" onClick={(e) => { e.preventDefault(); handleRequestOtp(e); }} disabled={loading}>
                                Resend OTP
                            </a>
                        </div>
                    )}

                    <div className="signin-link">
                        Need an account?{' '}
                        <Link to="/signup">Create one</Link>
                    </div>
                </form>
            </div>

            <div className="visual-section">
                <img src={Image} alt="Visual Representation" className='visual-image' />
            </div>
        </div>
    );
};

export default Login;
