const User = require('../models/User');
const sendEmail = require('../utils/emailSender');
const config = require('../config/config');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
}

const sendOtp = async (email) => {
    const otp = generateOTP(); 
    const otpExpires = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000); 

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

const verifyOtp = async (email, otp, name = undefined, dateOfBirth = undefined, password = undefined) => { 
    const user = await User.findOne({ email }).select('+otp +otpExpires +password');

    // --- Start Debugging Logs (Service) ---
    // console.log('--- Debugging verifyOtp (inside otpService) ---');
    // console.log('Received email:', email);
    // console.log('Received OTP (from frontend):', otp);
    // console.log('User found in DB:', user ? user.email : 'None');
    // if (user) {
    //     console.log('Stored OTP in DB:', user.otp);
    //     console.log('Stored OTP Expires in DB:', user.otpExpires);
    //     console.log('Current time:', new Date());
    //     console.log('Is OTP match:', user.otp === otp);
    //     console.log('Is OTP expired:', user.otpExpires < new Date());
    // }
    // --- End Debugging Logs ---

    if (!user) {
        console.log('VerifyOtp: User not found for email:', email);
        throw new Error('User not found');
    }

    if (user.otp !== otp) {
        console.log('VerifyOtp: Invalid OTP for user:', email);
        throw new Error('Invalid OTP. Please ensure you are using the latest OTP.');
    }

    if (user.otpExpires < new Date()) {
        console.log('VerifyOtp: OTP expired for user:', email);
        throw new Error('OTP expired. Please request a new one.');
    }

    if (name !== undefined && name !== null &&
        dateOfBirth !== undefined && dateOfBirth !== null &&
        password !== undefined && password !== null) {

        user.name = name;
        if (dateOfBirth instanceof Date && !isNaN(dateOfBirth)) {
            user.dateOfBirth = dateOfBirth;
        } else {
            console.error('VerifyOtp: Invalid Date of Birth provided during signup:', dateOfBirth);
            throw new Error('Invalid Date of Birth provided during signup.');
        }
        user.password = password;

        console.log('Assigned name, dateOfBirth, and password to user object for signup.');
    } else {
        console.log('VerifyOtp: Name, DateOfBirth, or Password not provided (likely login/reset password flow).');
    }

    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpires = undefined;
    
    try {
        await user.save(); 
        console.log('VerifyOtp: User saved successfully with isVerified:', user.isVerified);
    } catch (saveError) {
        console.error('VerifyOtp: Error saving user after verification:', saveError);
        if (saveError.name === 'ValidationError') {
            console.error('VerifyOtp: Mongoose Validation Errors:', saveError.errors);
        }
        throw new Error('Failed to update user after OTP verification.');
    }


    return user;
};

module.exports = { sendOtp, verifyOtp };
