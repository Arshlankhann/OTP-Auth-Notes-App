
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
        // For signup flow where user might not exist yet, create a new user without password
        user = new User({ email, otp, otpExpires });
        await user.save();
    }

    await sendEmail({
        to: email,
        subject: 'Your OTP for Note App Signup/Login',
        text: `Your OTP is: ${otp}. It is valid for ${config.otpExpiryMinutes} minutes.`,
        html: `<p>Your OTP is: <strong>${otp}</strong>. It is valid for ${config.otpExpiryMinutes} minutes.</p>`,
    });

    return user;
};

// Modified verifyOtp to accept name and dateOfBirth for signup flow
// These parameters will be passed from the controller, and will be undefined/null for login flow
const verifyOtp = async (email, otp, name, dateOfBirth) => {
    const user = await User.findOne({ email }).select('+otp +otpExpires'); // Select hidden fields

    if (!user) {
        throw new Error('User not found');
    }

    if (user.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    if (user.otpExpires < new Date()) {
        throw new Error('OTP expired');
    }


    console.log('--- Debugging verifyOtp ---');
    console.log('Received name:', name, 'Type:', typeof name);
    console.log('Received dateOfBirth:', dateOfBirth, 'Type:', typeof dateOfBirth);
    console.log('Is dateOfBirth instanceof Date:', dateOfBirth instanceof Date);
    console.log('Is dateOfBirth NaN (for Date objects):', dateOfBirth instanceof Date ? isNaN(dateOfBirth) : 'N/A');


  
    if (name !== undefined && name !== null && dateOfBirth !== undefined && dateOfBirth !== null) {
        // Ensure dateOfBirth is a valid Date object before assigning
        if (dateOfBirth instanceof Date && !isNaN(dateOfBirth)) { // Check if it's a Date object and not "Invalid Date"
            user.name = name;
            user.dateOfBirth = dateOfBirth; // Assign directly, it should already be a valid Date object
            console.log('Assigned name and dateOfBirth to user object.');
        } else {
            console.error('DateOfBirth is provided but invalid:', dateOfBirth);
            throw new Error('Invalid Date of Birth provided.');
        }
    } else {
        console.log('Name or DateOfBirth not provided (likely login flow).');
    }

    user.isVerified = true; // Mark user as verified
    user.otp = undefined; // Clear OTP after successful verification
    user.otpExpires = undefined;
    await user.save(); // Save the user document with updated fields and verification status
    console.log('User saved successfully with isVerified:', user.isVerified);

    return user;
};

module.exports = { sendOtp, verifyOtp };
