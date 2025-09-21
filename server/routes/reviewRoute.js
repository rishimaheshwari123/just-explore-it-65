const express = require("express");
const {
    createReview,
    getBusinessReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    voteOnReview,
    respondToReview
} = require("../controllers/reviewCtrl");

const router = express.Router();

// Public routes
router.post("/create", createReview);
router.get("/business/:businessId", getBusinessReviews);

// User routes
router.get("/user/:userId", getUserReviews);
router.put("/update/:reviewId", updateReview);
router.delete("/delete/:reviewId", deleteReview);
router.post("/vote/:reviewId", voteOnReview);

// Vendor routes
router.post("/respond/:reviewId", respondToReview);

module.exports = router;