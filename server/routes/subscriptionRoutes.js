const express = require('express');
const router = express.Router();
const {
    getSubscriptionPlans,
    getSubscriptionPlanById,
    purchaseSubscription,
    getBusinessSubscriptions,
    cancelSubscription,
    getVendorSubscriptions,
    updateExpiredSubscriptions
} = require('../controllers/subscriptionController');

const {
    getAllSubscriptionLogs,
    getBusinessSubscriptionLogs,
    getVendorSubscriptionLogs,
    getSubscriptionStats
} = require('../controllers/subscriptionLogController');

// Middleware for authentication (if available)
// const { authenticateVendor } = require('../middleware/auth');

// Public routes - Get subscription plans
router.get('/plans', getSubscriptionPlans);
router.get('/plans/:planId', getSubscriptionPlanById);

// Protected routes - Subscription management
// Note: Add authentication middleware when available
// router.use(authenticateVendor);

// Purchase subscription
router.post('/purchase', purchaseSubscription);

// Get business subscriptions
router.get('/business/:businessId', getBusinessSubscriptions);

// Get vendor's all subscriptions
router.get('/vendor/:vendorId', getVendorSubscriptions);

// Cancel subscription
router.put('/cancel/:subscriptionId', cancelSubscription);

// Subscription logs routes
router.get('/logs', getAllSubscriptionLogs);
router.get('/logs/business/:businessId', getBusinessSubscriptionLogs);
router.get('/logs/vendor/:vendorId', getVendorSubscriptionLogs);
router.get('/logs/stats', getSubscriptionStats);

// Utility route to update expired subscriptions (admin only)
router.post('/update-expired', async (req, res) => {
    try {
        const updatedCount = await updateExpiredSubscriptions();
        res.status(200).json({
            success: true,
            message: `Updated ${updatedCount} expired subscriptions`,
            data: { updatedCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating expired subscriptions',
            error: error.message
        });
    }
});

module.exports = router;