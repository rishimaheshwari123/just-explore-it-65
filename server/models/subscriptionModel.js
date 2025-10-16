const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Basic Premium', 'Business Pro', 'Enterprise Elite']
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 365 // days (1 year)
  },
  features: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    required: true,
    default: 1 // Higher number = higher priority in search
  }
}, {
  timestamps: true
});

const businessSubscriptionSchema = new mongoose.Schema({
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
  subscriptionPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'active'
  },
  paymentDetails: {
    // Core identifiers
    transactionId: String, // razorpay_payment_id
    orderId: String,       // razorpay_order_id
    signature: String,     // razorpay_signature

    // Amount & currency
    amount: Number,        // in INR (rupees)
    currency: String,      // e.g., 'INR'

    // Tax breakdown (GST)
    taxRate: { type: Number, default: 0.18 },
    taxAmount: Number,
    subtotal: Number,
    total: Number,

    // Method and gateway
    paymentMethod: String, // e.g., 'card', 'upi', 'netbanking'
    processor: {
      name: { type: String, default: 'Razorpay' },
      fee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 }
    },

    // Payer info (if available from gateway)
    email: String,
    contact: String,

    // Status info
    processorStatus: String, // razorpay payment status
    captured: Boolean,

    // Timestamps
    paymentDate: Date,
    paymentStatus: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed'
    }
  },
  autoRenewal: {
    type: Boolean,
    default: false
  },
  features: [{
    type: String
  }],
  priority: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index for efficient queries
businessSubscriptionSchema.index({ business: 1, status: 1 });
businessSubscriptionSchema.index({ vendor: 1, status: 1 });
businessSubscriptionSchema.index({ endDate: 1, status: 1 });

// Virtual to check if subscription is currently active
businessSubscriptionSchema.virtual('isCurrentlyActive').get(function() {
  return this.status === 'active' && this.endDate > new Date();
});

// Method to check if subscription is expired
businessSubscriptionSchema.methods.checkExpiry = function() {
  if (this.endDate < new Date() && this.status === 'active') {
    this.status = 'expired';
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get active subscription for a business
businessSubscriptionSchema.statics.getActiveSubscription = function(businessId) {
  return this.findOne({
    business: businessId,
    status: 'active',
    endDate: { $gt: new Date() }
  }).populate('subscriptionPlan');
};

// Static method to get all active premium businesses
businessSubscriptionSchema.statics.getActivePremiumBusinesses = function() {
  return this.find({
    status: 'active',
    endDate: { $gt: new Date() }
  }).populate('business subscriptionPlan');
};

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
const BusinessSubscription = mongoose.model('BusinessSubscription', businessSubscriptionSchema);

module.exports = {
  SubscriptionPlan,
  BusinessSubscription
};