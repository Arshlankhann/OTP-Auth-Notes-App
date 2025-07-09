

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        {/* Set the Dashboard as the primary route after login */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* You might want to redirect the root path to dashboard if logged in, or login if not */}
                        <Route path="/" element={<Dashboard />} /> {/* Or a protected route */}
                        {/* Remove these old routes: */}
                        {/* <Route path="/welcome" element={<Welcome />} /> */}
                        {/* <Route path="/notes" element={<Notes />} /> */}
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;