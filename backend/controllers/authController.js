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
        // Log and return validation errors for debugging
        console.log('Validation errors in signUpRequestOtp:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            // If user exists and is verified, they should use the password login
            return res.status(400).json({ message: 'User with this email already exists and is verified. Please use the password login page.' });
        } else if (user && !user.isVerified) {
            // User exists but not verified, resend OTP for verification
            await sendOtp(email);
            return res.status(200).json({ message: 'Account not verified. OTP sent for verification.' });
        } else {
            // New user, create a temporary record and send OTP
            await sendOtp(email); // sendOtp service will create user if not found
            return res.status(200).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
        }
    } catch (error) {
        console.error('Error in signUpRequestOtp:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// @desc    Verify OTP and complete signup (set password, name, DOB)
// @route   POST /api/auth/signup-verify-otp
// @access  Public
const signUpVerifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Log and return validation errors for debugging
        console.log('Validation errors in signUpVerifyOtp:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, name, dateOfBirth, password } = req.body; // Correctly destructured from req.body

    try {
        // Pass name, dateOfBirth, and password to the verifyOtp service function
        const user = await verifyOtp(email, otp, name, dateOfBirth, password);

        // Generate token and respond with user info
        const token = generateToken(user._id);
        res.status(200).json({
            message: 'Signup successful! You can now login with your password.',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                dateOfBirth: user.dateOfBirth
            },
            token,
        });
    } catch (error) {
        console.error('Error in signUpVerifyOtp:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Login user with email and password
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors in login:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find user and explicitly select password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Account not verified. Please complete signup via OTP.' });
        }

        if (!(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
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
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Request OTP for password reset
// @route   POST /api/auth/forgot-password-request-otp
// @access  Public
const forgotPasswordRequestOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // Send a generic success message even if user not found to prevent email enumeration
            return res.status(200).json({ message: 'If an account with that email exists, an OTP has been sent.' });
        }

        await sendOtp(email);
        res.status(200).json({ message: 'OTP sent to your email for password reset.' });
    } catch (error) {
        console.error('Error in forgotPasswordRequestOtp:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password-verify-otp
// @access  Public
const resetPasswordVerifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;

    try {
        // Verify OTP. The verifyOtp function will also mark user as verified if they weren't already.
        const user = await verifyOtp(email, otp);

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or email.' });
        }

        // Update the user's password
        user.password = newPassword; // Mongoose pre-save hook will hash this
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
    } catch (error) {
        console.error('Error in resetPasswordVerifyOtp:', error);
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
    login, // Export the new login function
    forgotPasswordRequestOtp, // Export new password reset request
    resetPasswordVerifyOtp,   // Export new password reset verification
    getMe,
};
