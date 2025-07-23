// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { sendOtp, verifyOtp } = require('../services/otpService');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// @desc    Request OTP for signup (new user)
// @route   POST /api/auth/signup-request-otp
// @access  Public
const signUpRequestOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User with this email already exists. Please use the login page.' });
        } else if (user && !user.isVerified) {
            // User exists but not verified, resend OTP for verification
            await sendOtp(email);
            return res.status(200).json({ message: 'Account not verified. OTP sent for verification.' });
        } else {
            // New user, create a temporary record and send OTP
            // The sendOtp service will create the user if not found
            await sendOtp(email);
            return res.status(200).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// @desc    Verify OTP and complete signup
// @route   POST /api/auth/signup-verify-otp
// @access  Public
const signUpVerifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, name, dateOfBirth } = req.body;

    try {
        // Pass name and dateOfBirth directly to verifyOtp service
        const user = await verifyOtp(email, otp, name, dateOfBirth);

        // Generate token and respond with user info
        const token = generateToken(user._id);
        res.status(200).json({
            message: 'Signup successful!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                dateOfBirth: user.dateOfBirth
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};


// @desc    Request OTP for login (existing user)
// @route   POST /api/auth/login-request-otp
// @access  Public
const loginRequestOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors in loginRequestOtp:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // --- Start Debugging Logs ---
    console.log('--- loginRequestOtp Debugging ---');
    console.log('Received email for OTP request (from req.body):', email);
    console.log('Type of email:', typeof email);
    // --- End Debugging Logs ---

    try {
        const user = await User.findOne({ email });

        // --- Start Debugging Logs ---
        console.log('Result of User.findOne for email:', email);
        console.log('User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('Found user email:', user.email);
            console.log('Found user isVerified status:', user.isVerified);
        }
        // --- End Debugging Logs ---

        if (!user) {
            console.log('Error: User not found in database for email:', email);
            return res.status(400).json({ message: 'Account not found. Please sign up.' });
        }

        // If user exists (verified or not), send OTP.
        // The verification status will be checked in loginVerifyOtp.
        await sendOtp(email);
        console.log('OTP sent successfully for email:', email);
        res.status(200).json({ message: 'OTP sent to your email for login.' });
    } catch (error) {
        console.error('Error in loginRequestOtp:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// @desc    Verify OTP and complete login
// @route   POST /api/auth/login-verify-otp
// @access  Public
const loginVerifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    try {
        const user = await verifyOtp(email, otp); // This verifies OTP and marks user as verified

        // After OTP is verified, check if the account is actually verified for login purposes
        if (!user.isVerified) {
            // This case should ideally not happen if verifyOtp sets isVerified to true,
            // but it's a good safeguard or for cases where OTP verification doesn't complete the profile.
            return res.status(400).json({ message: 'Account not fully verified. Please complete signup or re-verify.' });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                dateOfBirth: user.dateOfBirth
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};


// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is populated by authMiddleware
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        dateOfBirth: req.user.dateOfBirth
    };
    res.status(200).json(user);
};


module.exports = {
    signUpRequestOtp,
    signUpVerifyOtp,
    loginRequestOtp,
    loginVerifyOtp,
    getMe,
};
