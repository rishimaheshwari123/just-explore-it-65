const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        // Business Reference
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
        },
        
        // User Information
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Allow anonymous reviews
        },
        
        // Guest User Information (for non-logged users)
        guestInfo: {
            name: {
                type: String,
                required: function() {
                    return !this.user; // Required if no user
                },
                trim: true,
            },
            email: {
                type: String,
                required: function() {
                    return !this.user; // Required if no user
                },
                lowercase: true,
                trim: true,
            },
        },
        
        // Review Content
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        
        // Review Status
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'hidden'],
            default: 'approved',
        },
        
        // Moderation
        moderation: {
            isModerated: {
                type: Boolean,
                default: false,
            },
            moderatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "auth", // Admin who moderated
            },
            moderatedAt: Date,
            moderationReason: String,
        },
        
        // Helpful Votes
        helpfulVotes: {
            helpful: {
                type: Number,
                default: 0,
            },
            notHelpful: {
                type: Number,
                default: 0,
            },
            voters: [{
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                vote: {
                    type: String,
                    enum: ['helpful', 'not_helpful'],
                },
                votedAt: {
                    type: Date,
                    default: Date.now,
                },
            }],
        },
        
        // Review Metadata
        metadata: {
            ipAddress: String,
            userAgent: String,
            source: {
                type: String,
                enum: ['website', 'mobile_app'],
                default: 'website',
            },
        },
        
        // Response from Business Owner
        businessResponse: {
            message: String,
            respondedAt: Date,
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vendor",
            },
        },
        
        // Verification
        verification: {
            isVerified: {
                type: Boolean,
                default: false,
            },
            verifiedPurchase: {
                type: Boolean,
                default: false,
            },
            verificationMethod: {
                type: String,
                enum: ['email', 'phone', 'purchase', 'manual'],
            },
        },
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for reviewer name
reviewSchema.virtual('reviewerName').get(function() {
    if (this.user && this.user.name) {
        return this.user.name;
    }
    return this.guestInfo?.name || 'Anonymous';
});

// Virtual for reviewer email
reviewSchema.virtual('reviewerEmail').get(function() {
    if (this.user && this.user.email) {
        return this.user.email;
    }
    return this.guestInfo?.email || null;
});

// Index for better query performance
reviewSchema.index({ business: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Compound index for business reviews
reviewSchema.index({ business: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);