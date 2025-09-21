const express = require("express")
const { 
    createInquiryCtrl, 
    getInquriyCtrl,
    createBusinessInquiryCtrl,
    getAllInquiriesCtrl,
    getVendorInquiriesCtrl,
    getInquiryDetailsCtrl,
    replyToInquiryCtrl,
    updateInquiryStatusCtrl,
    getBusinessInquiriesCtrl,
    getUserInquiriesCtrl,
    userReplyToInquiryCtrl
} = require("../controllers/inquriyCtrl")
const router = express.Router()

// Legacy routes (for backward compatibility)
router.post("/create", createInquiryCtrl)
router.get("/getAll", getInquriyCtrl)

// New Business Inquiry Routes
router.post("/business/create", createBusinessInquiryCtrl)
router.get("/business/:businessId", getBusinessInquiriesCtrl)

// Vendor Inquiry Management Routes
router.get("/vendor/:vendorId", getVendorInquiriesCtrl)
router.get("/details/:inquiryId", getInquiryDetailsCtrl)
router.post("/reply/:inquiryId", replyToInquiryCtrl)
router.put("/status/:inquiryId", updateInquiryStatusCtrl)

// User Routes
router.get("/user/:userId", getUserInquiriesCtrl)
router.post("/user-reply/:inquiryId", userReplyToInquiryCtrl)

// Admin Routes
router.get("/admin/all", getAllInquiriesCtrl)

module.exports = router