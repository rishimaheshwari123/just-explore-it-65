const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
    {
        // Personal Information
        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            minlength: 6,
        },

        phone: {
            type: String,
            trim: true,
        },

        alternatePhone: {
            type: String,
            trim: true,
        },

        // Business Owner Information
        ownerDetails: {
            firstName: {
                type: String,
                trim: true,
            },
            lastName: {
                type: String,
                trim: true,
            },
            dateOfBirth: Date,
            gender: {
                type: String,
                enum: ['Male', 'Female', 'Other'],
            },
        },

        // Company/Business Information
        company: {
            type: String,
            trim: true,
        },

        businessRegistrationNumber: {
            type: String,
            trim: true,
        },

        gstNumber: {
            type: String,
            trim: true,
        },

        // Address Information
        address: {
            street: {
                type: String,
                trim: true,
            },
            area: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            state: {
                type: String,
                trim: true,
            },
            pincode: {
                type: String,
                trim: true,
            },
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        // Verification Documents
        documents: {
            aadhar: {
                number: String,
                frontImage: {
                    public_id: String,
                    url: String,
                },
                backImage: {
                    public_id: String,
                    url: String,
                },
                isVerified: {
                    type: Boolean,
                    default: false,
                },
            },
            pan: {
                number: String,
                image: {
                    public_id: String,
                    url: String,
                },
                isVerified: {
                    type: Boolean,
                    default: false,
                },
            },
            businessLicense: {
                number: String,
                image: {
                    public_id: String,
                    url: String,
                },
                isVerified: {
                    type: Boolean,
                    default: false,
                },
            },
        },

        // Profile Information
        profileImage: {
            public_id: String,
            url: String,
        },

        // Account Status
        role: {
            type: String,
            enum: ["vendor", "premium_vendor", "enterprise_vendor"],
            default: "vendor",
        },

        status: {
            type: String,
            enum: ['active', 'inactive', 'pending', 'suspended', 'rejected'],
            default: 'pending',
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
            isDocumentVerified: {
                type: Boolean,
                default: false,
            },
            verificationLevel: {
                type: String,
                enum: ['basic', 'standard', 'premium'],
                default: 'basic',
            },
        },

        // Subscription Information
        subscription: {
            plan: {
                type: String,
                enum: ['free', 'basic', 'premium', 'enterprise'],
                default: 'free',
            },
            startDate: Date,
            endDate: Date,
            isActive: {
                type: Boolean,
                default: false,
            },
            features: [{
                name: String,
                isEnabled: Boolean,
            }],
        },

        // Business Analytics
        analytics: {
            totalBusinesses: {
                type: Number,
                default: 0,
            },
            totalViews: {
                type: Number,
                default: 0,
            },
            totalCalls: {
                type: Number,
                default: 0,
            },
            totalInquiries: {
                type: Number,
                default: 0,
            },
        },

        // Payment Information
        paymentInfo: {
            totalEarnings: {
                type: Number,
                default: 0,
            },
            pendingPayments: {
                type: Number,
                default: 0,
            },
            lastPaymentDate: Date,
        },

        // Settings
        settings: {
            notifications: {
                email: {
                    type: Boolean,
                    default: true,
                },
                sms: {
                    type: Boolean,
                    default: true,
                },
                push: {
                    type: Boolean,
                    default: true,
                },
            },
            privacy: {
                showPhone: {
                    type: Boolean,
                    default: true,
                },
                showEmail: {
                    type: Boolean,
                    default: true,
                },
            },
        },

        // Login Information
        lastLogin: Date,
        loginCount: {
            type: Number,
            default: 0,
        },

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

module.exports = mongoose.model("Vendor", vendorSchema);
