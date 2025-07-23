
const express = require('express');
const router = express.Router();
const {
    signUpRequestOtp,
    signUpVerifyOtp,
    login, 
    forgotPasswordRequestOtp, 
    resetPasswordVerifyOtp,   
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

const passwordValidation = body('password') 
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long');

const newPasswordValidation = body('newPassword') 
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long');


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
        dateOfBirthValidation,
        passwordValidation 
    ],
    signUpVerifyOtp
);

router.post(
    '/login',
    [
        emailValidation,
        passwordValidation
    ],
    login
);

router.post(
    '/forgot-password-request-otp',
    [emailValidation],
    forgotPasswordRequestOtp
);

router.post(
    '/reset-password-verify-otp',
    [
        emailValidation,
        otpValidation,
        newPasswordValidation
    ],
    resetPasswordVerifyOtp
);


router.get('/me', protect, getMe);

module.exports = router;
