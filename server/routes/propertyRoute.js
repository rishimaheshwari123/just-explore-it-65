const express = require("express")
const { createPropertyCtrl, getPropertiesByVendor, updatePropertyCtrl, getPropertiesCtrl, deletePropertyCtrl, getPropertiesByIdCtrl, incrementPropertyViewCtrl } = require("../controllers/propertyCtrl")
const router = express.Router()


router.post("/create", createPropertyCtrl)
router.post("/get-vendor-property", getPropertiesByVendor)
router.put('/update/:id', updatePropertyCtrl);
router.get('/getAll', getPropertiesCtrl);
router.get('/get/:id', getPropertiesByIdCtrl);
router.put('/increment-view/:id', incrementPropertyViewCtrl);
router.delete('/delete/:id', deletePropertyCtrl);





module.exports = router