// backend/services/otpService.js
const User = require('../models/User');
const generateOTP = require('../utils/otpGenerator');
const sendEmail = require('../utils/emailSender');
const config = require('../config/config');

const sendOtp = async (email) => {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000); // OTP valid for X minutes

    let user = await User.findOne({ email });

    if (user) {
        user.otp = otp;
        user.otpExpires = otpExpires;
        user.isVerified = false; // Reset verification status if re-sending OTP
        await user.save();
    } else {
        // For signup flow where user might not exist yet, create a new user without password, name, DOB initially
        user = new User({ email, otp, otpExpires });
        await user.save();
    }

    await sendEmail({
        to: email,
        subject: 'Your One-Time Password (OTP) for Account Verification',
        text: `Hello,

Your One-Time Password (OTP) is: ${otp}

Please use this code to verify your account. This OTP is valid for the next ${config.otpExpiryMinutes} minutes.

If you did not request this verification, please ignore this email.

Best regards,
The [Your Company Name] Team
    `,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) is:</p>
            <h2 style="color: #2c3e50;">${otp}</h2>
            <p>Please use this code to verify your account. This OTP is valid for the next 
            <strong>${config.otpExpiryMinutes} minutes</strong>.</p>
            <p>If you did not request this verification, please ignore this email.</p>
            <p style="margin-top: 20px;">Best regards,<br><strong>The [Your Company Name] Team</strong></p>
        </div>
    `,
    });


    return user;
};

// Modified verifyOtp to accept name, dateOfBirth, and password for signup flow
// These parameters will be passed from the controller when signing up.
// For login, only email and otp will be passed, so name/dateOfBirth/password will be undefined.
const verifyOtp = async (email, otp, name = undefined, dateOfBirth = undefined, password = undefined) => {
    // Explicitly select otp and otpExpires to ensure they are fetched
    // Also select password if it exists, to allow setting it
    const user = await User.findOne({ email }).select('+otp +otpExpires +password');

    if (!user) {
        throw new Error('User not found');
    }

    if (user.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    if (user.otpExpires < new Date()) {
        throw new Error('OTP expired');
    }

    // --- Start Debugging Logs (retained for this specific issue) ---
    console.log('--- Debugging verifyOtp (inside otpService) ---');
    console.log('Received email:', email);
    console.log('Received OTP:', otp);
    console.log('Received name:', name, 'Type:', typeof name);
    console.log('Received dateOfBirth:', dateOfBirth, 'Type:', typeof dateOfBirth);
    console.log('Received password:', password ? 'Provided' : 'Not Provided');
    console.log('Is dateOfBirth instanceof Date:', dateOfBirth instanceof Date);
    console.log('Is dateOfBirth NaN (for Date objects):', dateOfBirth instanceof Date ? isNaN(dateOfBirth) : 'N/A');
    // --- End Debugging Logs ---

    // Only set name, dateOfBirth, and password if they are provided (i.e., during signup verification)
    if (name !== undefined && name !== null &&
        dateOfBirth !== undefined && dateOfBirth !== null &&
        password !== undefined && password !== null) {

        user.name = name;
        // Ensure dateOfBirth is a valid Date object before assigning
        if (dateOfBirth instanceof Date && !isNaN(dateOfBirth)) {
            user.dateOfBirth = dateOfBirth;
        } else {
            // If dateOfBirth is provided but invalid, throw an error
            throw new Error('Invalid Date of Birth provided during signup.');
        }
        user.password = password; // Password will be hashed by the pre-save hook in User model

        console.log('Assigned name, dateOfBirth, and password to user object for signup.');
    } else {
        console.log('Name, DateOfBirth, or Password not provided (likely login flow or incomplete signup data).');
    }

    user.isVerified = true; // Mark user as verified
    user.otp = undefined; // Clear OTP after successful verification
    user.otpExpires = undefined;
    await user.save(); // Save the user document with updated fields and verification status
    console.log('User saved successfully with isVerified:', user.isVerified);

    return user;
};

module.exports = { sendOtp, verifyOtp };
