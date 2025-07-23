
const express = require('express');
const router = express.Router();
const {
    signUpRequestOtp,
    signUpVerifyOtp,
    loginRequestOtp,
    loginVerifyOtp,
    getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const emailValidation = body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail();

const otpValidation = body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits');

const nameValidation = body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long');

const dateOfBirthValidation = body('dateOfBirth')
    .notEmpty().withMessage('Date of Birth is required')
    .isISO8601().toDate().withMessage('Please enter a valid date of birth (YYYY-MM-DD)');


router.post(
    '/signup-request-otp',
    [emailValidation],
    signUpRequestOtp
);

router.post(
    '/signup-verify-otp',
    [
        emailValidation,
        otpValidation,
        nameValidation,
        dateOfBirthValidation 
    ],
    signUpVerifyOtp
);

router.post(
    '/login-request-otp',
    [emailValidation],
    loginRequestOtp
);

router.post(
    '/login-verify-otp',
    [
        emailValidation,
        otpValidation
    ],
    loginVerifyOtp
);

router.get('/me', protect, getMe);

module.exports = router;
