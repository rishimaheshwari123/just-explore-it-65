const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
        },
        password: {
            type: String,
            trim: true,
        },

        role: {
            type: String,
            enum: ["super_admin", "admin"],
            default: "admin",
        },
        
        // Admin specific fields
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'auth',
        },
        
        createdAt: {
            type: Date,
            default: Date.now,
        },
        
        // Access permissions for admin roles
        permissions: {
            manageVendors: {
                type: Boolean,
                default: false,
            },
            addBusiness: {
                type: Boolean,
                default: false,
            },
            editBusiness: {
                type: Boolean,
                default: false,
            },
            supportCenter: {
                type: Boolean,
                default: false,
            },
            blogs: {
                type: Boolean,
                default: false,
            },
            manageUsers: {
                type: Boolean,
                default: false,
            },
            subscriptionLogs: {
                type: Boolean,
                default: false,
            },
            exportData: {
                type: Boolean,
                default: false,
            },
        },
        
        token: {
            type: String,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("auth", authSchema);
