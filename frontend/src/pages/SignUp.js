import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react'; 
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import Image from './rightimg.jpg';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('request-otp');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const { handleSignUp } = useAuth();
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const data = await authService.signUpRequestOtp(email);
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

        if (!password) {
            setError('Password is required.');
            toast.error('Password is required.');
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            toast.error('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            await handleSignUp(email, otp, name, dateOfBirth, password);
            toast.success('Sign up successful! Welcome!');
            navigate('/dashboard'); 
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'OTP verification failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="container">
            <div className="form-section">
                <div className="logo">
                    <div className="logo-icon"></div>
                    <span className="logo-text">HD</span>
                </div>

                <h1 className="form-title">Sign up</h1>
                <p className="form-subtitle">Sign up to enjoy the feature of HD</p>

                {error && <div className="message error-message">{error}</div>}
                {successMessage && <div className="message success-message">{successMessage}</div>}

                <form onSubmit={step === 'request-otp' ? handleRequestOtp : handleVerifyOtp}>
                    <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input
                            type="text"
                            className="form-input" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                            disabled={step === 'verify-otp'}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <input
                            type="date"
                            className="form-input" 
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required
                            disabled={step === 'verify-otp'}
                        />
                    </div>

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
                    </div>

                    {step === 'verify-otp' && (
                        <>
                            <div className="form-group">
                                <label className="form-label">OTP</label>
                                <div className="otp-group"> 
                                    <input
                                        type="text" 
                                        className="form-input otp-input"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter OTP"
                                        maxLength="6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Set Password</label>
                                <div className="password-group"> 
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        className="form-input password-input" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Set your password"
                                        required
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle" 
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div className="resend-otp-link">
                                <button
                                    type="button"
                                    className="btn-link" 
                                    onClick={(e) => { e.preventDefault(); handleRequestOtp(e); }}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </>
                    )}

                    <button type="submit" className="signup-btn" disabled={loading}>
                        {step === 'request-otp'
                            ? loading
                                ? 'Sending OTP...'
                                : 'Get OTP'
                            : loading
                                ? 'Verifying...'
                                : 'Sign Up'}
                    </button>

                    <div className="signin-link">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
                    </div>
                </form>
            </div>

            <div className="visual-section"> 
                <img src={Image} alt="Decorative visual" className="visual-image" />
            </div>
        </div>
    );
};

export default SignUp;
