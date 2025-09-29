const SubscriptionLog = require('../models/subscriptionLogModel');
const Business = require('../models/businessModel');

// Get all subscription logs for admin
const getAllSubscriptionLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, action, businessId, vendorId } = req.query;
        
        const filter = {};
        if (action) filter.action = action;
        if (businessId) filter.business = businessId;
        if (vendorId) filter.vendor = vendorId;

        const logs = await SubscriptionLog.find(filter)
            .populate('business', 'businessName category')
            .populate('vendor', 'name email')
            .populate('plan', 'name price')
            .populate('previousPlan', 'name price')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await SubscriptionLog.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                logs,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            },
            message: 'Subscription logs retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching subscription logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscription logs',
            error: error.message
        });
    }
};

// Get subscription logs for a specific business
const getBusinessSubscriptionLogs = async (req, res) => {
    try {
        const { businessId } = req.params;
        const { limit = 50 } = req.query;
        const vendorId = req.user?.id || req.query.vendorId;

        // Verify business belongs to vendor (if vendor is making request)
        if (vendorId) {
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
        }

        const logs = await SubscriptionLog.getBusinessLogs(businessId, limit);

        res.status(200).json({
            success: true,
            data: logs,
            message: 'Business subscription logs retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching business subscription logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching business subscription logs',
            error: error.message
        });
    }
};

// Get subscription logs for a vendor
const getVendorSubscriptionLogs = async (req, res) => {
    try {
        const vendorId = req.user?.id || req.params.vendorId;
        const { limit = 100 } = req.query;

        const logs = await SubscriptionLog.getVendorLogs(vendorId, limit);

        res.status(200).json({
            success: true,
            data: logs,
            message: 'Vendor subscription logs retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching vendor subscription logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vendor subscription logs',
            error: error.message
        });
    }
};

// Get subscription statistics
const getSubscriptionStats = async (req, res) => {
    try {
        const { vendorId, startDate, endDate } = req.query;
        
        const filter = {};
        if (vendorId) filter.vendor = vendorId;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const stats = await SubscriptionLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const totalRevenue = await SubscriptionLog.aggregate([
            { $match: { ...filter, action: 'purchased' } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                actionStats: stats,
                totalRevenue: totalRevenue[0]?.total || 0
            },
            message: 'Subscription statistics retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching subscription statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscription statistics',
            error: error.message
        });
    }
};

module.exports = {
    getAllSubscriptionLogs,
    getBusinessSubscriptionLogs,
    getVendorSubscriptionLogs,
    getSubscriptionStats
};