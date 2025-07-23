
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Welcome = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleGoToNotes = () => {
        navigate('/notes');
    };

    return (
        <div className="welcome-container">
            <h2>Welcome, {user.name || user.email}!</h2> 
            {user.dateOfBirth && (
                <p>Date of Birth: {format(new Date(user.dateOfBirth), 'MMM dd, yyyy')}</p>
            )}
            <p>This is your personal welcome page.</p>
            <div className="welcome-actions">
                <button onClick={handleGoToNotes} className="btn btn-primary">Go to My Notes</button>
                <button onClick={logout} className="btn btn-secondary">Logout</button>
            </div>
        </div>
    );
};

export default Welcome;
