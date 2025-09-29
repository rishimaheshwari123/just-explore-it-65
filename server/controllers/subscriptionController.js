const SubscriptionPlan = require('../models/subscriptionModel').SubscriptionPlan;
const BusinessSubscription = require('../models/subscriptionModel').BusinessSubscription;
const Business = require('../models/businessModel');
const Vendor = require('../models/vendorModel');
const SubscriptionLog = require('../models/subscriptionLogModel');

// Get all subscription plans
const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({ isActive: true })
            .sort({ priority: -1, price: 1 });
        
        res.status(200).json({
            success: true,
            data: plans,
            message: 'Subscription plans retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscription plans',
            error: error.message
        });
    }
};

// Get subscription plan by ID
const getSubscriptionPlanById = async (req, res) => {
    try {
        const { planId } = req.params;
        const plan = await SubscriptionPlan.findById(planId);
        
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Subscription plan not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: plan,
            message: 'Subscription plan retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching subscription plan:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscription plan',
            error: error.message
        });
    }
};

// Purchase subscription for business
const purchaseSubscription = async (req, res) => {
    try {
        const { businessId, planId, paymentDetails } = req.body;
        console.log(req.body)
        const vendorId = req.user?.id || req.body.vendorId;

        // Validate required fields
        if (!businessId || !planId || !vendorId) {
            return res.status(400).json({
                success: false,
                message: 'Business ID, Plan ID, and Vendor ID are required'
            });
        }

        // Check if business exists and belongs to vendor
        const business = await Business.findOne({ 
            _id: businessId, 
            vendor: vendorId 
        });
        
        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found or unauthorized'
            });
        }

        // Get subscription plan
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan || !plan.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Subscription plan not found or inactive'
            });
        }

        // Check if business already has an active subscription
        const existingActiveSubscription = await BusinessSubscription.findOne({
            business: businessId,
            status: 'active',
            endDate: { $gt: new Date() }
        });

        if (existingActiveSubscription) {
            return res.status(400).json({
                success: false,
                message: 'Business already has an active subscription'
            });
        }

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + plan.duration);

        // Create new subscription
        const subscription = new BusinessSubscription({
            business: businessId,
            vendor: vendorId,
            subscriptionPlan: planId,
            plan: planId,
            planName: plan.name,
            startDate,
            endDate,
            price: plan.price,
            status: 'active',
            paymentDetails: paymentDetails || {},
            features: plan.features,
            priority: plan.priority
        });

        await subscription.save();

        // Update business with subscription details
        const subscriptionData = {
            subscriptionId: subscription._id,
            planName: plan.name,
            startDate,
            endDate,
            price: plan.price,
            status: 'active',
            features: plan.features,
            priority: plan.priority
        };

        // Add to subscriptions array and update current subscription
        business.subscriptions.push(subscriptionData);
        business.currentSubscription = subscriptionData;
        business.isPremium = true;

        // Update premium features based on plan
        if (plan.features.includes('Featured Listing')) {
            business.premiumFeatures.featuredListing = true;
        }
        if (plan.features.includes('Priority Support')) {
            business.premiumFeatures.prioritySupport = true;
        }
        if (plan.features.includes('Advanced Analytics')) {
            business.premiumFeatures.analyticsAccess = true;
        }
        if (plan.features.includes('Custom Branding')) {
            business.premiumFeatures.customBranding = true;
        }

        await business.save();

        // Log subscription activity
        await SubscriptionLog.logActivity({
            business: businessId,
            vendor: vendorId,
            subscription: subscription._id,
            plan: planId,
            action: 'purchased',
            amount: plan.price,
            paymentDetails: {
                transactionId: paymentDetails?.transactionId || `TXN_${Date.now()}`,
                paymentMethod: paymentDetails?.paymentMethod || 'online',
                paymentDate: new Date(),
                paymentStatus: 'completed'
            },
            metadata: {
                userAgent: req.headers['user-agent'] || '',
                ipAddress: req.ip || req.connection.remoteAddress || '',
                source: 'web'
            },
            notes: `Subscription purchased for business: ${business.businessName}`
        });

        res.status(201).json({
            success: true,
            data: {
                subscription,
                business: {
                    id: business._id,
                    name: business.businessName,
                    isPremium: business.isPremium,
                    currentSubscription: business.currentSubscription
                }
            },
            message: 'Subscription purchased successfully'
        });

    } catch (error) {
        console.error('Error purchasing subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Error purchasing subscription',
            error: error.message
        });
    }
};

// Get business subscriptions
const getBusinessSubscriptions = async (req, res) => {
    try {
        const { businessId } = req.params;
        const vendorId = req.user?.id || req.query.vendorId;

        // Verify business belongs to vendor
        const business = await Business.findOne({ 
            _id: businessId, 
            vendor: vendorId 
        });
        
        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found or unauthorized'
            });
        }

        const subscriptions = await BusinessSubscription.find({ 
            business: businessId 
        })
        .populate('plan', 'name price features priority')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                business: {
                    id: business._id,
                    name: business.businessName,
                    isPremium: business.isPremium,
                    currentSubscription: business.currentSubscription
                },
                subscriptions
            },
            message: 'Business subscriptions retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching business subscriptions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching business subscriptions',
            error: error.message
        });
    }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const vendorId = req.user?.id || req.body.vendorId;

        const subscription = await BusinessSubscription.findById(subscriptionId)
            .populate('business');

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        // Verify vendor owns the business
        if (subscription.vendor.toString() !== vendorId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to cancel this subscription'
            });
        }

        // Update subscription status
        subscription.status = 'cancelled';
        subscription.endDate = new Date(); // End immediately
        await subscription.save();

        // Log cancellation activity
        await SubscriptionLog.logActivity({
            business: subscription.business._id,
            vendor: vendorId,
            subscription: subscription._id,
            plan: subscription.plan || subscription.subscriptionPlan,
            action: 'cancelled',
            amount: 0,
            paymentDetails: {
                transactionId: `CANCEL_${Date.now()}`,
                paymentMethod: 'cancellation',
                paymentDate: new Date(),
                paymentStatus: 'completed'
            },
            metadata: {
                userAgent: req.headers['user-agent'] || '',
                ipAddress: req.ip || req.connection.remoteAddress || '',
                source: 'web'
            },
            notes: `Subscription cancelled for business: ${subscription.business.businessName}`
        });

        // Update business
        const business = await Business.findById(subscription.business._id);
        if (business) {
            // Update subscription in array
            const subIndex = business.subscriptions.findIndex(
                sub => sub.subscriptionId.toString() === subscriptionId
            );
            if (subIndex !== -1) {
                business.subscriptions[subIndex].status = 'cancelled';
                business.subscriptions[subIndex].endDate = new Date();
            }

            // Clear current subscription if it's the cancelled one
            if (business.currentSubscription && 
                business.currentSubscription.subscriptionId.toString() === subscriptionId) {
                business.currentSubscription = null;
                business.isPremium = false;
                
                // Reset premium features
                business.premiumFeatures = {
                    featuredListing: false,
                    prioritySupport: false,
                    analyticsAccess: false,
                    customBranding: false
                };
            }

            await business.save();
        }

        res.status(200).json({
            success: true,
            data: subscription,
            message: 'Subscription cancelled successfully'
        });

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling subscription',
            error: error.message
        });
    }
};

// Get vendor's all business subscriptions
const getVendorSubscriptions = async (req, res) => {
    try {
        const vendorId = req.user?.id || req.params.vendorId;

        const subscriptions = await BusinessSubscription.find({ 
            vendor: vendorId 
        })
        .populate('business', 'businessName category address.city')
        .populate('plan', 'name price features priority')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: subscriptions,
            message: 'Vendor subscriptions retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching vendor subscriptions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vendor subscriptions',
            error: error.message
        });
    }
};

// Check and update expired subscriptions (utility function)
const updateExpiredSubscriptions = async () => {
    try {
        const now = new Date();
        
        // Find expired active subscriptions
        const expiredSubscriptions = await BusinessSubscription.find({
            status: 'active',
            endDate: { $lt: now }
        });

        for (const subscription of expiredSubscriptions) {
            // Update subscription status
            subscription.status = 'expired';
            await subscription.save();

            // Update business
            const business = await Business.findById(subscription.business);
            if (business) {
                // Update subscription in array
                const subIndex = business.subscriptions.findIndex(
                    sub => sub.subscriptionId.toString() === subscription._id.toString()
                );
                if (subIndex !== -1) {
                    business.subscriptions[subIndex].status = 'expired';
                }

                // Clear current subscription if it's expired
                if (business.currentSubscription && 
                    business.currentSubscription.subscriptionId.toString() === subscription._id.toString()) {
                    business.currentSubscription = null;
                    business.isPremium = false;
                    
                    // Reset premium features
                    business.premiumFeatures = {
                        featuredListing: false,
                        prioritySupport: false,
                        analyticsAccess: false,
                        customBranding: false
                    };
                }

                await business.save();
            }
        }

        console.log(`Updated ${expiredSubscriptions.length} expired subscriptions`);
        return expiredSubscriptions.length;

    } catch (error) {
        console.error('Error updating expired subscriptions:', error);
        throw error;
    }
};

module.exports = {
    getSubscriptionPlans,
    getSubscriptionPlanById,
    purchaseSubscription,
    getBusinessSubscriptions,
    cancelSubscription,
    getVendorSubscriptions,
    updateExpiredSubscriptions
};