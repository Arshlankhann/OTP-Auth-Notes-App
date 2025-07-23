// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs

const UserSchema = new mongoose.Schema({
    name: { // New field for user's name
        type: String,
        required: function() { return this.isVerified; }, // Name is required once user is verified
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: { // Reintroducing password field
        type: String,
        required: function() { return this.isVerified; }, // Password is required once user is verified
        select: false // Don't return password by default in queries
    },
    otp: {
        type: String,
        select: false // Don't return OTP by default in queries
    },
    otpExpires: {
        type: Date,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    dateOfBirth: { // Field for Date of Birth
        type: Date,
        required: function() { return this.isVerified; } // DOB is required once user is verified
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving if it's modified or new
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // Ensure password is selected before attempting to compare
    if (!this.password) {
        // If password was not selected in the query, fetch it
        const userWithPassword = await mongoose.model('User').findById(this._id).select('+password');
        if (!userWithPassword) return false; // User not found
        this.password = userWithPassword.password; // Set it for this instance
    }
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
