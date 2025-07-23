import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import authService from '../services/authService';
import Image from './rightimg.jpg'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState('request-otp'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const data = await authService.forgotPasswordRequestOtp(email);
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

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (!newPassword) {
            setError('New password is required.');
            toast.error('New password is required.');
            setLoading(false);
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            toast.error('New password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const data = await authService.resetPasswordVerifyOtp(email, otp, newPassword);
            toast.success(data.message);
            navigate('/login'); 
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Password reset failed. Please check OTP or try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    return (
        <div className="container">
            <div className="form-section">
                <div className="logo">
                    <div className="logo-icon"></div>
                    <span className="logo-text">HD</span>
                </div>

                <h1 className="form-title">Reset Password</h1>
                <p className="form-subtitle">Enter your email to receive an OTP to reset your password.</p>

                {error && <div className="message error-message">{error}</div>}
                {successMessage && <div className="message success-message">{successMessage}</div>}

                <form onSubmit={step === 'request-otp' ? handleRequestOtp : handleResetPassword}>
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
                                <input
                                    type="text" 
                                    className="form-input"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    maxLength="6"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div className="password-group">
                                    <input
                                        type={newPasswordVisible ? 'text' : 'password'}
                                        className="form-input password-input"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={toggleNewPasswordVisibility}
                                    >
                                        {newPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="resend-otp-link" >
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
                                ? 'Resetting Password...'
                                : 'Reset Password'}
                    </button>

                    <div className="signin-link">
                        Remembered your password?{' '}
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

export default ForgotPassword;
