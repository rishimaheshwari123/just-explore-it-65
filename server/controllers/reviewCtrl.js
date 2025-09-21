const Review = require("../models/reviewModel");
const Business = require("../models/businessModel");
const User = require("../models/userModel");

// Create Review
const createReview = async (req, res) => {
    try {
        const { businessId, rating, comment, name, email, userId } = req.body;

        // Validate required fields
        if (!businessId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Business ID, rating, and comment are required"
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check if business exists
        const business = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        // For non-logged users, name and email are required
        if (!userId && (!name || !email)) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required for guest reviews"
            });
        }

        // Check if user already reviewed this business
        if (userId) {
            const existingReview = await Review.findOne({
                business: businessId,
                user: userId
            });

            if (existingReview) {
                return res.status(400).json({
                    success: false,
                    message: "You have already reviewed this business"
                });
            }
        }

        // Create review
        const reviewData = {
            business: businessId,
            rating,
            comment,
            metadata: {
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                source: 'website'
            }
        };

        if (userId) {
            reviewData.user = userId;
        } else {
            reviewData.guestInfo = { name, email };
        }

        const review = new Review(reviewData);
        await review.save();

        // Update business ratings
        await updateBusinessRatings(businessId);

        // Update user analytics if logged in
        if (userId) {
            await User.findByIdAndUpdate(userId, {
                $inc: { 'analytics.totalReviews': 1 }
            });
        }

        // Populate review for response
        const populatedReview = await Review.findById(review._id)
            .populate('business', 'businessName category')
            .populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review: populatedReview
        });
    } catch (error) {
        console.error("Create review error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get Business Reviews
const getBusinessReviews = async (req, res) => {
    try {
        const { businessId } = req.params;
        const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;

        const filter = { 
            business: businessId,
            status: 'approved'
        };

        if (rating) {
            filter.rating = parseInt(rating);
        }

        let sortOption = { createdAt: -1 }; // Default: newest first
        if (sortBy === 'oldest') sortOption = { createdAt: 1 };
        if (sortBy === 'highest') sortOption = { rating: -1, createdAt: -1 };
        if (sortBy === 'lowest') sortOption = { rating: 1, createdAt: -1 };
        if (sortBy === 'helpful') sortOption = { 'helpfulVotes.helpful': -1, createdAt: -1 };

        const reviews = await Review.find(filter)
            .populate('user', 'name')
            .populate('businessResponse.respondedBy', 'name company')
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments(filter);

        // Get rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { business: mongoose.Types.ObjectId(businessId), status: 'approved' } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        res.status(200).json({
            success: true,
            reviews,
            ratingDistribution,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error("Get business reviews error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get User Reviews
const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ user: userId })
            .populate('business', 'businessName category images')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments({ user: userId });

        res.status(200).json({
            success: true,
            reviews,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error("Get user reviews error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update Review
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment, userId } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Check if user owns this review
        if (review.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own reviews"
            });
        }

        // Update review
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();

        // Update business ratings
        await updateBusinessRatings(review.business);

        const updatedReview = await Review.findById(reviewId)
            .populate('business', 'businessName category')
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review: updatedReview
        });
    } catch (error) {
        console.error("Update review error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete Review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { userId } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Check if user owns this review
        if (review.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own reviews"
            });
        }

        await Review.findByIdAndDelete(reviewId);

        // Update business ratings
        await updateBusinessRatings(review.business);

        // Update user analytics
        await User.findByIdAndUpdate(userId, {
            $inc: { 'analytics.totalReviews': -1 }
        });

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        console.error("Delete review error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Vote on Review Helpfulness
const voteOnReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { vote, userId } = req.body; // vote: 'helpful' or 'not_helpful'

        if (!['helpful', 'not_helpful'].includes(vote)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vote type"
            });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Check if user already voted
        const existingVote = review.helpfulVotes.voters.find(
            voter => voter.user.toString() === userId
        );

        if (existingVote) {
            // Update existing vote
            if (existingVote.vote !== vote) {
                // Remove old vote count
                if (existingVote.vote === 'helpful') {
                    review.helpfulVotes.helpful -= 1;
                } else {
                    review.helpfulVotes.notHelpful -= 1;
                }

                // Add new vote count
                if (vote === 'helpful') {
                    review.helpfulVotes.helpful += 1;
                } else {
                    review.helpfulVotes.notHelpful += 1;
                }

                existingVote.vote = vote;
                existingVote.votedAt = new Date();
            }
        } else {
            // Add new vote
            if (vote === 'helpful') {
                review.helpfulVotes.helpful += 1;
            } else {
                review.helpfulVotes.notHelpful += 1;
            }

            review.helpfulVotes.voters.push({
                user: userId,
                vote,
                votedAt: new Date()
            });
        }

        await review.save();

        res.status(200).json({
            success: true,
            message: "Vote recorded successfully",
            helpfulVotes: review.helpfulVotes
        });
    } catch (error) {
        console.error("Vote on review error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Business Owner Response to Review
const respondToReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { message, vendorId } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Response message is required"
            });
        }

        const review = await Review.findById(reviewId).populate('business');
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Check if vendor owns this business
        if (review.business.vendor.toString() !== vendorId) {
            return res.status(403).json({
                success: false,
                message: "You can only respond to reviews of your own business"
            });
        }

        // Add business response
        review.businessResponse = {
            message,
            respondedAt: new Date(),
            respondedBy: vendorId
        };

        await review.save();

        const updatedReview = await Review.findById(reviewId)
            .populate('business', 'businessName')
            .populate('businessResponse.respondedBy', 'name company');

        res.status(200).json({
            success: true,
            message: "Response added successfully",
            review: updatedReview
        });
    } catch (error) {
        console.error("Respond to review error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Helper function to update business ratings
const updateBusinessRatings = async (businessId) => {
    try {
        const mongoose = require('mongoose');
        
        const ratingStats = await Review.aggregate([
            { $match: { business: new mongoose.Types.ObjectId(businessId), status: 'approved' } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    five: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                    four: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                    three: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                    two: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                    one: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
                }
            }
        ]);

        if (ratingStats.length > 0) {
            const stats = ratingStats[0];
            await Business.findByIdAndUpdate(businessId, {
                'ratings.average': Math.round(stats.averageRating * 10) / 10,
                'ratings.totalReviews': stats.totalReviews,
                'ratings.breakdown.five': stats.five,
                'ratings.breakdown.four': stats.four,
                'ratings.breakdown.three': stats.three,
                'ratings.breakdown.two': stats.two,
                'ratings.breakdown.one': stats.one
            });
        } else {
            // No reviews, reset ratings
            await Business.findByIdAndUpdate(businessId, {
                'ratings.average': 0,
                'ratings.totalReviews': 0,
                'ratings.breakdown.five': 0,
                'ratings.breakdown.four': 0,
                'ratings.breakdown.three': 0,
                'ratings.breakdown.two': 0,
                'ratings.breakdown.one': 0
            });
        }
    } catch (error) {
        console.error("Update business ratings error:", error);
    }
};

module.exports = {
    createReview,
    getBusinessReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    voteOnReview,
    respondToReview
};