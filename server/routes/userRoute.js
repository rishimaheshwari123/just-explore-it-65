const express = require("express");
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserStatus
} = require("../controllers/userCtrl");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User routes
router.get("/profile/:userId", getUserProfile);
router.put("/profile/:userId", updateUserProfile);

// Admin routes
router.get("/admin/all", getAllUsers);
router.put("/admin/status/:userId", updateUserStatus);

module.exports = router;