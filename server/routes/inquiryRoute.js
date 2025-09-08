const express = require("express")
const { createInquiryCtrl, getInquriyCtrl } = require("../controllers/inquriyCtrl")
const router = express.Router()


router.post("/create", createInquiryCtrl)
router.get("/getAll", getInquriyCtrl)





module.exports = router