const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Personal Information
        name: {
            type: String,
            required: true,
            trim: true,
        },
        
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        
        phone: {
            type: String,
            trim: true,
        },
        
        // Profile Information
        profileImage: {
            public_id: String,
            url: String,
        },
        
        // Account Status
        role: {
            type: String,
            enum: ["user"],
            default: "user",
        },
        
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
        },
        
        // Verification Status
        verification: {
            isEmailVerified: {
                type: Boolean,
                default: false,
            },
            isPhoneVerified: {
                type: Boolean,
                default: false,
            },
        },
        
        // User Preferences
        preferences: {
            notifications: {
                email: {
                    type: Boolean,
                    default: true,
                },
                sms: {
                    type: Boolean,
                    default: false,
                },
            },
            privacy: {
                showEmail: {
                    type: Boolean,
                    default: false,
                },
                showPhone: {
                    type: Boolean,
                    default: false,
                },
            },
        },
        
        // Activity Tracking
        analytics: {
            totalInquiries: {
                type: Number,
                default: 0,
            },
            totalReviews: {
                type: Number,
                default: 0,
            },
            lastLoginAt: Date,
            loginCount: {
                type: Number,
                default: 0,
            },
        },
        
        // Location (optional)
        location: {
            city: String,
            state: String,
            country: {
                type: String,
                default: 'India',
            },
        },
        
        // Authentication
        token: {
            type: String,
        },
        
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model("User", userSchema);