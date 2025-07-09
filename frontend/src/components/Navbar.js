
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">Note App</Link>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span>Welcome, {user.email}!</span>
                        <button onClick={logout} className="btn btn-link">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-link">Login</Link>
                        <Link to="/signup" className="btn btn-link">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;