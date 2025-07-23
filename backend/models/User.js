const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: function() { return this.isVerified; }, 
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: { 
        type: String,
        required: function() { return this.isVerified; },
        select: false 
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
        required: function() { return this.isVerified; } 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) {
        const userWithPassword = await mongoose.model('User').findById(this._id).select('+password');
        if (!userWithPassword) return false; 
        this.password = userWithPassword.password; 
    }
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
