const express = require('express');
const {
    createBusinessCtrl,
    updateBusinessCtrl,
    getBusinessesCtrl,
    getBusinessByIdCtrl,
    getBusinessesByVendorCtrl,
    deleteBusinessCtrl,
    getFeaturedBusinessesCtrl,
    getTrendingBusinessesCtrl,
    incrementBusinessInteractionCtrl,
    
    // Legacy exports for backward compatibility
    createPropertyCtrl,
    updatePropertyCtrl,
    getPropertiesCtrl,
    getPropertiesByIdCtrl,
    getPropertiesByVendor,
    deletePropertyCtrl,
    incrementPropertyViewCtrl,
} = require('../controllers/businessCtrl');

const router = express.Router();

// New Business Routes
router.post('/businesses', createBusinessCtrl);
router.get('/businesses', getBusinessesCtrl);
router.get('/businesses/featured', getFeaturedBusinessesCtrl);
router.get('/featured-businesses', getFeaturedBusinessesCtrl);
router.get('/businesses/trending', getTrendingBusinessesCtrl);
router.get('/businesses/:id', getBusinessByIdCtrl);
router.put('/businesses/:id', updateBusinessCtrl);
router.delete('/businesses/:id', deleteBusinessCtrl);
router.get('/businesses/vendor/:vendorId', getBusinessesByVendorCtrl);
router.post('/businesses/:id/interaction', incrementBusinessInteractionCtrl);

// Legacy Property Routes (for backward compatibility)
router.post('/properties', createPropertyCtrl);
router.get('/properties', getPropertiesCtrl);
router.get('/properties/:id', getPropertiesByIdCtrl);
router.put('/properties/:id', updatePropertyCtrl);
router.delete('/properties/:id', deletePropertyCtrl);
router.post('/properties/vendor', getPropertiesByVendor);
router.post('/properties/:id/view', incrementPropertyViewCtrl);

module.exports = router;