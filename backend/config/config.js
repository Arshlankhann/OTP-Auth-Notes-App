require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
    otpExpiryMinutes: 5,
    email: {
        service: 'gmail',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
};