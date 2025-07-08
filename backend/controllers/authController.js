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
            await sendOtp(email);
            return res.status(200).json({ message: 'Account not verified. OTP sent for verification.' });
        } else {
            await sendOtp(email);
            return res.status(200).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};


const signUpVerifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, name, dateOfBirth } = req.body;

    try {
        const user = await verifyOtp(email, otp); 
        if (!user.name || !user.dateOfBirth) { // Only set if not already set
            user.name = name;
            user.dateOfBirth = new Date(dateOfBirth);
            await user.save();
        }

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


const loginRequestOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.isVerified) {
            return res.status(400).json({ message: 'Account not found or not verified. Please sign up.' });
        }

        await sendOtp(email);
        res.status(200).json({ message: 'OTP sent to your email for login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

const loginVerifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    try {
        const user = await verifyOtp(email, otp); // This verifies OTP and marks user as verified

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Account not verified. Please try signing up.' });
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


const getMe = async (req, res) => {
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
