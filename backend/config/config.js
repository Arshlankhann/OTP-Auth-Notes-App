require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
    otpExpiryMinutes: 5, // OTP valid for 5 minutes
    email: {
        service: 'gmail', // e.g., 'gmail', 'SendGrid', etc.
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
};