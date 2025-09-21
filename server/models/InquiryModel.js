// models/Inquiry.js
const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
    {
        // Customer Information
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        
        // Inquiry Details
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        
        // Business Reference
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },
        
        // User Reference (if logged in)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        
        // Inquiry Type
        inquiryType: {
            type: String,
            enum: ['general', 'service', 'pricing', 'booking', 'complaint', 'other'],
            default: 'general',
        },
        
        // Priority Level
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        
        // Status Management
        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'in_progress', 'resolved', 'closed'],
            default: 'new',
        },
        
        // Response from Vendor
        vendorResponse: {
            message: String,
            respondedAt: Date,
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vendor",
            },
        },
        
        // Follow-up Information
        followUp: {
            isRequired: {
                type: Boolean,
                default: false,
            },
            scheduledDate: Date,
            notes: String,
        },
        
        // Customer Satisfaction
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        feedback: String,
        
        // Additional Metadata
        source: {
            type: String,
            enum: ['website', 'mobile_app', 'phone', 'email', 'walk_in'],
            default: 'website',
        },
        
        // Customer Location (optional)
        customerLocation: {
            city: String,
            area: String,
            pincode: String,
        },
        
        // Service Interest (if applicable)
        serviceInterest: [{
            serviceName: String,
            budget: {
                min: Number,
                max: Number,
                currency: {
                    type: String,
                    default: 'INR',
                },
            },
        }],
        
        // Preferred Contact Method
        preferredContact: {
            type: String,
            enum: ['phone', 'email', 'whatsapp', 'any'],
            default: 'any',
        },
        
        // Best Time to Contact
        bestTimeToContact: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'anytime'],
            default: 'anytime',
        },
        
        // Internal Notes (for vendor use)
        internalNotes: [{
            note: String,
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vendor",
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        
        // Tracking
        readAt: Date,
        repliedAt: Date,
        resolvedAt: Date,
        
        // Legacy field for backward compatibility
        propertyType: {
            type: String,
            trim: true,
        },
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for response time calculation
inquirySchema.virtual('responseTime').get(function() {
    if (this.repliedAt && this.createdAt) {
        return Math.round((this.repliedAt - this.createdAt) / (1000 * 60 * 60)); // in hours
    }
    return null;
});

// Virtual for resolution time calculation
inquirySchema.virtual('resolutionTime').get(function() {
    if (this.resolvedAt && this.createdAt) {
        return Math.round((this.resolvedAt - this.createdAt) / (1000 * 60 * 60 * 24)); // in days
    }
    return null;
});

// Index for better query performance
inquirySchema.index({ business: 1, vendor: 1 });
inquirySchema.index({ status: 1, priority: -1 });
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ vendor: 1, status: 1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
