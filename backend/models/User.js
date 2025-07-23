
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { // New field for user's name
        type: String,
        // required: function() { return this.isVerified; }, // Name is required once user is verified
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    otp: {
        type: String,
        select: false 
    },
    otpExpires: {
        type: Date,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    dateOfBirth: {
        type: Date,
        // required: function() { return this.isVerified; } // DOB is required once user is verified
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
