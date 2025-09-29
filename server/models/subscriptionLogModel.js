const mongoose = require('mongoose');

const subscriptionLogSchema = new mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessSubscription',
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
        required: true
    },
    action: {
        type: String,
        enum: ['purchased', 'renewed', 'cancelled', 'expired', 'upgraded', 'downgraded'],
        required: true
    },
    previousPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
        default: null
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDetails: {
        transactionId: String,
        paymentMethod: String,
        paymentDate: {
            type: Date,
            default: Date.now
        },
        paymentStatus: {
            type: String,
            enum: ['completed', 'pending', 'failed'],
            default: 'completed'
        }
    },
    metadata: {
        userAgent: String,
        ipAddress: String,
        source: {
            type: String,
            default: 'web'
        }
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for efficient queries
subscriptionLogSchema.index({ business: 1, createdAt: -1 });
subscriptionLogSchema.index({ vendor: 1, createdAt: -1 });
subscriptionLogSchema.index({ subscription: 1 });
subscriptionLogSchema.index({ action: 1, createdAt: -1 });

// Static method to log subscription activity
subscriptionLogSchema.statics.logActivity = async function(data) {
    try {
        const log = new this(data);
        await log.save();
        return log;
    } catch (error) {
        console.error('Error logging subscription activity:', error);
        throw error;
    }
};

// Static method to get logs for a business
subscriptionLogSchema.statics.getBusinessLogs = function(businessId, limit = 50) {
    return this.find({ business: businessId })
        .populate('plan', 'name price')
        .populate('previousPlan', 'name price')
        .sort({ createdAt: -1 })
        .limit(limit);
};

// Static method to get logs for a vendor
subscriptionLogSchema.statics.getVendorLogs = function(vendorId, limit = 100) {
    return this.find({ vendor: vendorId })
        .populate('business', 'businessName category')
        .populate('plan', 'name price')
        .populate('previousPlan', 'name price')
        .sort({ createdAt: -1 })
        .limit(limit);
};

module.exports = mongoose.model('SubscriptionLog', subscriptionLogSchema);