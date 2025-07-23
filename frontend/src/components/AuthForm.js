
import React from 'react';

const AuthForm = ({ type, onSubmit, email, setEmail, otp, setOtp, dateOfBirth, setDateOfBirth, loading, error, successMessage }) => {
    return (
        <form onSubmit={onSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                />
            </div>

            {type === 'signup-request' && (
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Sending OTP...' : 'Sign Up / Send OTP'}
                </button>
            )}

            {type === 'verify-otp' && (
                <>
                    <div className="form-group">
                        <label htmlFor="otp">OTP:</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength="6"
                            className="form-control"
                        />
                    </div>
                    {/* New Date of Birth Input */}
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth:</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required // Make required if you want to enforce it
                            className="form-control"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Verifying...' : 'Verify OTP & Sign Up'}
                    </button>
                </>
            )}


        </form>
    );
};

export default AuthForm;


