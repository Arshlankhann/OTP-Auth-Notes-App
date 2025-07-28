import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react'; 
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
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        console.log('Frontend: handleRequestOtp called with email:', email); 
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

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            toast.error('Please enter a valid 6-digit OTP.');
            setLoading(false);
            return;
        }

        // console.log('Frontend: handleVerifyOtp called.'); 
        // console.log('Frontend: Current email state:', email); 
        // console.log('Frontend: Current OTP state:', otp); 
        // console.log('Frontend: About to call login (from useAuth).'); 
        // console.log('Frontend: Type of login:', typeof login); 

        if (typeof login !== 'function') {
            console.error('Frontend Error: login function from AuthContext is not available.');
            setError('Authentication service not available. Please try refreshing the page.');
            toast.error('Authentication service error.');
            setLoading(false);
            return;
        }

        try {
            await login(email, otp); 
            toast.success('Logged in successfully!');
            navigate('/dashboard'); 
        } catch (err) {
            const errorMessage = err.message || err.response?.data?.message || 'OTP verification failed. Please try again.';
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

                {step === 'request-otp' ? (
                    <form onSubmit={handleRequestOtp}> 
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                        <div className="form-group">
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
                        <div className="resend-otp-link" style={{ textAlign: 'center', marginTop: '10px'}}>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={(e) => { e.preventDefault(); handleRequestOtp(e); }}
                                disabled={loading}
                            >
                                Resend OTP
                            </button>
                        </div>
                        <div className="checkbox-container" style={{ textAlign: 'left', marginTop: '5px',marginBottom: '10px' }}>
                            <input
                                type="checkbox"
                                id="keepLoggedInRequest"
                                className="checkbox-input"
                                checked={keepLoggedIn}
                                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                            />
                            <label htmlFor="keepLoggedInRequest" className="checkbox-label">Keep me logged in</label>
                        </div>
                        <button type="submit" className="signup-btn" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Get OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}> 
                        <div className="form-group">
                            <label className="form-label">Email</label> 
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                disabled 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">OTP</label>
                            <div className="otp-group">
                                <input
                                    type={otpVisible ? 'text' : 'password'} 
                                    className="form-input otp-input"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    maxLength="6"
                                    required
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

                        <div className="resend-otp-link" style={{ textAlign: 'center', marginTop: '10px' }}>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={(e) => { e.preventDefault(); handleRequestOtp(e); }}
                                disabled={loading}
                            >
                                Resend OTP
                            </button>
                        </div>
                        <div className="checkbox-container" style={{ textAlign: 'left', marginTop: '15px' }}>
                            <input
                                type="checkbox"
                                id="keepLoggedInVerify"
                                className="checkbox-input"
                                checked={keepLoggedIn}
                                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                            />
                            <label htmlFor="keepLoggedInVerify" className="checkbox-label">Keep me logged in</label>
                        </div>
                        <button type="submit" className="signup-btn" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                )}

                <div className="signin-link">
                    Need an account?{' '}
                    <Link to="/signup">Create one</Link>
                </div>
            </div>

            <div className="visual-section">
                <img src={Image} alt="Decorative visual" className="visual-image" />
            </div>
        </div>
    );
};

export default Login;
