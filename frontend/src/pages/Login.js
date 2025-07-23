import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react'; 
import { useAuth } from '../contexts/AuthContext';
import Image from './rightimg.jpg'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password); 
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
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

                <h1 className="form-title">Sign In</h1>
                <p className="form-subtitle">Please login to continue to your account</p>

                {error && <div className="message error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                        <label className="form-label">Password</label>
                        <div className="password-group">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                className="form-input password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
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

                    <div className="forgot-password-link" style={{ textAlign: 'right', marginBottom: '20px' }}>
                        <Link to="/forgot-password" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

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
