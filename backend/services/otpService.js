
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
        user.isVerified = false;
        await user.save();
    } else {
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
Arshlan Khan
    `,
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) is:</p>
            <h2 style="color: #2c3e50;">${otp}</h2>
            <p>Please use this code to verify your account. This OTP is valid for the next 
            <strong>${config.otpExpiryMinutes} minutes</strong>.</p>
            <p>If you did not request this verification, please ignore this email.</p>
            <p style="margin-top: 20px;">Best regards,<br><strong>Arshlan Khan</strong></p>
        </div>
    `,
});

    return user;
};

const verifyOtp = async (email, otp, name, dateOfBirth) => {
    const user = await User.findOne({ email }).select('+otp +otpExpires'); 

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
       
        if (dateOfBirth instanceof Date && !isNaN(dateOfBirth)) { 
            user.name = name;
            user.dateOfBirth = dateOfBirth; 
            console.log('Assigned name and dateOfBirth to user object.');
        } else {
            console.error('DateOfBirth is provided but invalid:', dateOfBirth);
            throw new Error('Invalid Date of Birth provided.');
        }
    } else {
        console.log('Name or DateOfBirth not provided (likely login flow).');
    }

    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpires = undefined;
    await user.save(); 
    console.log('User saved successfully with isVerified:', user.isVerified);

    return user;
};

module.exports = { sendOtp, verifyOtp };
