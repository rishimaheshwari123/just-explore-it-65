const express = require("express")
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
    trackBusinessInteractionCtrl,
    
    // Legacy exports for backward compatibility
    createPropertyCtrl,
    updatePropertyCtrl,
    getPropertiesCtrl,
    getPropertiesByIdCtrl,
    getPropertiesByVendor,
    deletePropertyCtrl,
    incrementPropertyViewCtrl,
} = require("../controllers/businessCtrl")
const router = express.Router()

// New Business Routes
router.post("/create-business", createBusinessCtrl)
router.get("/business", getBusinessesCtrl)
router.get("/businesses", getBusinessesCtrl)
router.get("/businesses/featured", getFeaturedBusinessesCtrl)
router.get("/featured-businesses", getFeaturedBusinessesCtrl)
router.get("/business/:id", getBusinessByIdCtrl)
router.get("/businesses/trending", getTrendingBusinessesCtrl)
router.put("/business/update/:id", updateBusinessCtrl)
router.delete("/business/delete/:id", deleteBusinessCtrl)
router.get("/businesses/vendor/:vendorId", getBusinessesByVendorCtrl)
router.post("/business/:id/interaction", incrementBusinessInteractionCtrl)
router.post("/business/:id/track-interaction", trackBusinessInteractionCtrl)

// Legacy Property Routes (for backward compatibility)
router.post("/create", createPropertyCtrl)
router.post("/get-vendor-property", getPropertiesByVendor)
router.put('/update/:id', updatePropertyCtrl);
router.get('/getAll', getPropertiesCtrl);
router.get('/get/:id', getPropertiesByIdCtrl);
router.put('/increment-view/:id', incrementPropertyViewCtrl);
router.delete('/delete/:id', deletePropertyCtrl);





module.exports = router