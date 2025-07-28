const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { sendOtp, verifyOtp } = require('../services/otpService');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: '1h', 
    });
};

const signUpRequestOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors in signUpRequestOtp:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User with this email already exists and is verified. Please use login page.' });
        } else if (user && !user.isVerified) {
            await sendOtp(email);
            return res.status(200).json({ message: 'Account not verified. OTP sent for verification.' });
        } else {
            await sendOtp(email); 
            return res.status(200).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
        }
    } catch (error) {
        console.error('Error in signUpRequestOtp:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

const signUpVerifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors in signUpVerifyOtp:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, name, dateOfBirth, password } = req.body; 

    try {
        const user = await verifyOtp(email, otp, name, dateOfBirth, password);

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

const loginRequestOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors in loginRequestOtp:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Account not found. Please sign up.' });
        }

        await sendOtp(email);
        res.status(200).json({ message: 'OTP sent to your email for login.' });
    } catch (error) {
        console.error('Error in loginRequestOtp:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

const loginVerifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors in loginVerifyOtp:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    // console.log('--- loginVerifyOtp Controller Debugging ---');
    // console.log('Received email for verification:', email);
    // console.log('Received OTP for verification:', otp);

    try {
        const user = await verifyOtp(email, otp);
        if (!user.isVerified) {
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
        console.error('Error in loginVerifyOtp controller:', error);
        res.status(400).json({ message: error.message });
    }
};

const forgotPasswordRequestOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: 'If an account with that email exists, an OTP has been sent.' });
        }

        await sendOtp(email);
        res.status(200).json({ message: 'OTP sent to your email for password reset.' });
    } catch (error) {
        console.error('Error in forgotPasswordRequestOtp:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

const resetPasswordVerifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;

    try {
        const user = await verifyOtp(email, otp); 

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or email.' });
        }

        user.password = newPassword; 
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
    } catch (error) {
        console.error('Error in resetPasswordVerifyOtp:', error);
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
    forgotPasswordRequestOtp,
    resetPasswordVerifyOtp,
    getMe,
};
