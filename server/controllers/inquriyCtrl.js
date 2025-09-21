const Inquiry = require("../models/InquiryModel");
const Business = require("../models/businessModel");
const Vendor = require("../models/vendorModel");

// Create Business Inquiry
const createBusinessInquiryCtrl = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone, 
            subject, 
            message, 
            businessId,
            inquiryType,
            priority,
            preferredContact,
            bestTimeToContact,
            serviceInterest,
            customerLocation
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !subject || !message || !businessId) {
            return res.status(400).json({ 
                success: false,
                error: "Name, email, phone, subject, message, and business ID are required" 
            });
        }

        // Check if business exists and get vendor info
        const business = await Business.findById(businessId).populate('vendor');
        if (!business) {
            return res.status(404).json({ 
                success: false,
                error: "Business not found" 
            });
        }

        // Create new inquiry
        const newInquiry = new Inquiry({
            name,
            email,
            phone,
            subject,
            message,
            business: businessId,
            vendor: business.vendor._id,
            inquiryType: inquiryType || 'general',
            priority: priority || 'medium',
            preferredContact: preferredContact || 'any',
            bestTimeToContact: bestTimeToContact || 'anytime',
            serviceInterest: serviceInterest || [],
            customerLocation: customerLocation || {},
            source: 'website'
        });

        await newInquiry.save();

        // Populate the inquiry with business and vendor details
        const populatedInquiry = await Inquiry.findById(newInquiry._id)
            .populate('business', 'businessName category contactInfo')
            .populate('vendor', 'name email phone company');

        res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully! The business owner will contact you soon.",
            inquiry: populatedInquiry,
        });
    } catch (error) {
        console.error("Business inquiry submission error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Something went wrong. Please try again." 
        });
    }
};

// Get All Inquiries (Admin)
const getAllInquiriesCtrl = async (req, res) => {
    try {
        const { status, priority, page = 1, limit = 10 } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const inquiries = await Inquiry.find(filter)
            .populate('business', 'businessName category contactInfo')
            .populate('vendor', 'name email phone company')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Inquiry.countDocuments(filter);

        res.status(200).json({
            success: true,
            inquiries,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error("Get inquiries error:", error);
        res.status(500).json({ 
            success: false,
            message: 'Something went wrong' 
        });
    }
};

// Get Vendor's Inquiries
const getVendorInquiriesCtrl = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { status, priority, page = 1, limit = 10 } = req.query;
        
        const filter = { vendor: vendorId };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const inquiries = await Inquiry.find(filter)
            .populate('business', 'businessName category contactInfo images')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Inquiry.countDocuments(filter);

        // Get inquiry statistics
        const mongoose = require('mongoose');
        const stats = await Inquiry.aggregate([
            { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            inquiries,
            stats,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error("Get vendor inquiries error:", error);
        res.status(500).json({ 
            success: false,
            message: 'Something went wrong' 
        });
    }
};

// Get Single Inquiry Details
const getInquiryDetailsCtrl = async (req, res) => {
    try {
        const { inquiryId } = req.params;

        const inquiry = await Inquiry.findById(inquiryId)
            .populate('business', 'businessName category contactInfo images address')
            .populate('vendor', 'name email phone company')
            .populate('vendorResponse.respondedBy', 'name');

        if (!inquiry) {
            return res.status(404).json({ 
                success: false,
                error: "Inquiry not found" 
            });
        }

        // Mark as read if it's new
        if (inquiry.status === 'new') {
            inquiry.status = 'read';
            inquiry.readAt = new Date();
            await inquiry.save();
        }

        res.status(200).json({
            success: true,
            inquiry
        });
    } catch (error) {
        console.error("Get inquiry details error:", error);
        res.status(500).json({ 
            success: false,
            message: 'Something went wrong' 
        });
    }
};

// Vendor Reply to Inquiry
const replyToInquiryCtrl = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const { message, vendorId, status } = req.body;

        if (!message) {
            return res.status(400).json({ 
                success: false,
                error: "Reply message is required" 
            });
        }

        const inquiry = await Inquiry.findById(inquiryId);
        if (!inquiry) {
            return res.status(404).json({ 
                success: false,
                error: "Inquiry not found" 
            });
        }

        // Check if vendor owns this inquiry
        if (inquiry.vendor.toString() !== vendorId) {
            return res.status(403).json({ 
                success: false,
                error: "Unauthorized to reply to this inquiry" 
            });
        }

        // Update inquiry with vendor response
        inquiry.vendorResponse = {
            message,
            respondedAt: new Date(),
            respondedBy: vendorId
        };
        inquiry.status = status || 'replied';
        inquiry.repliedAt = new Date();

        await inquiry.save();

        const updatedInquiry = await Inquiry.findById(inquiryId)
            .populate('business', 'businessName category')
            .populate('vendorResponse.respondedBy', 'name');

        res.status(200).json({
            success: true,
            message: "Reply sent successfully",
            inquiry: updatedInquiry
        });
    } catch (error) {
        console.error("Reply to inquiry error:", error);
        res.status(500).json({ 
            success: false,
            message: 'Something went wrong' 
        });
    }
};

// Update Inquiry Status
const updateInquiryStatusCtrl = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const { status, internalNote, vendorId } = req.body;

        const inquiry = await Inquiry.findById(inquiryId);
        if (!inquiry) {
            return res.status(404).json({ 
                success: false,
                error: "Inquiry not found" 
            });
        }

        // Update status
        inquiry.status = status;
        
        if (status === 'resolved') {
            inquiry.resolvedAt = new Date();
        }

        // Add internal note if provided
        if (internalNote) {
            inquiry.internalNotes.push({
                note: internalNote,
                addedBy: vendorId,
                addedAt: new Date()
            });
        }

        await inquiry.save();

        res.status(200).json({
            success: true,
            message: "Inquiry status updated successfully",
            inquiry
        });
    } catch (error) {
        console.error("Update inquiry status error:", error);
        res.status(500).json({ 
            success: false,
            message: 'Something went wrong' 
        });
    }
};

// Get Business Inquiries (for specific business)
const getBusinessInquiriesCtrl = async (req, res) => {
    try {
        const { businessId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;
        
        const filter = { business: businessId };
        if (status) filter.status = status;

        const inquiries = await Inquiry.find(filter)
            .populate('vendor', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Inquiry.countDocuments(filter);

        res.status(200).json({
            success: true,
            inquiries,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error("Get business inquiries error:", error);
        res.status(500).json({ 
            success: false,
            message: 'Something went wrong' 
        });
    }
};

// Legacy function for backward compatibility
const createInquiryCtrl = createBusinessInquiryCtrl;
const getInquriyCtrl = getAllInquiriesCtrl;

module.exports = { 
    createInquiryCtrl,
    getInquriyCtrl,
    createBusinessInquiryCtrl,
    getAllInquiriesCtrl,
    getVendorInquiriesCtrl,
    getInquiryDetailsCtrl,
    replyToInquiryCtrl,
    updateInquiryStatusCtrl,
    getBusinessInquiriesCtrl
};
