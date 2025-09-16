const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
    {
        // Basic Business Information
        businessName: {
            type: String,
            required: true,
            trim: true,
        },
        
        businessType: {
            type: String,
            required: true,
           
        },

        category: {
            type: String,
            required: true,
            enum: [
                'Food & Dining', 'Healthcare', 'Education', 'Shopping', 
                'Hotels & Travel', 'Fitness & Wellness', 'Beauty & Spa',
                'Electronics & Technology', 'Automotive', 'Real Estate',
                'Financial Services', 'Professional Services', 'Home & Garden',
                'Entertainment', 'Sports & Recreation', 'Government & Community'
            ],
        },

        subCategory: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        // Contact Information
        contactInfo: {
            primaryPhone: {
                type: String,
                required: true,
                trim: true,
            },
            secondaryPhone: {
                type: String,
                trim: true,
            },
            whatsappNumber: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                trim: true,
                lowercase: true,
            },
            website: {
                type: String,
                trim: true,
            },
            socialMedia: {
                facebook: String,
                instagram: String,
                twitter: String,
                linkedin: String,
            },
        },

        // Location Information
        address: {
            street: {
                type: String,
                required: true,
                trim: true,
            },
            area: {
                type: String,
                required: true,
                trim: true,
            },
            city: {
                type: String,
                required: true,
                trim: true,
            },
            state: {
                type: String,
                required: true,
                trim: true,
            },
            pincode: {
                type: String,
                required: true,
                trim: true,
            },
            landmark: {
                type: String,
                trim: true,
            },
        },

        area: {
            type: String,
            required: true,
            trim: true,
        },

        coordinates: {
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
        },
        
        // GeoJSON location for geospatial queries
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number] // [longitude, latitude]
            }
        },

        // Business Hours
        businessHours: {
            monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
            tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
            wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
            thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
            friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
            saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
            sunday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
        },

        // Services and Pricing
        services: [{
            name: {
                type: String,
                required: true,
                trim: true,
            },
            description: {
                type: String,
                trim: true,
            },
            price: {
                min: Number,
                max: Number,
                currency: {
                    type: String,
                    default: 'INR',
                },
                priceType: {
                    type: String,
                    enum: ['fixed', 'range', 'starting_from', 'negotiable'],
                    default: 'fixed',
                },
            },
        }],

        // Pricing Information
        priceRange: {
            type: String,
            enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'],
            default: '₹₹',
        },

        // Ratings and Reviews
        ratings: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            totalReviews: {
                type: Number,
                default: 0,
            },
            breakdown: {
                five: { type: Number, default: 0 },
                four: { type: Number, default: 0 },
                three: { type: Number, default: 0 },
                two: { type: Number, default: 0 },
                one: { type: Number, default: 0 },
            },
        },

        // Business Features
        features: [{
            type: String,
            enum: [
                'WiFi Available', 'Parking Available', 'AC Available', 
                'Card Payment Accepted', 'Home Delivery', 'Online Booking',
                'Wheelchair Accessible', '24/7 Service', 'Emergency Service',
                'Cash on Delivery', 'Return Policy', 'Warranty Available',
                'Free Consultation', 'Expert Staff', 'Quality Assured'
            ],
        }],

        // Verification and Trust
        verification: {
            isVerified: {
                type: Boolean,
                default: false,
            },
            verifiedBy: {
                type: String,
                enum: ['admin', 'document', 'phone', 'email'],
            },
            verificationDate: Date,
            trustScore: {
                type: Number,
                default: 0,
                min: 0,
                max: 100,
            },
        },

        // Media
        images: [{
            public_id: String,
            url: String,
            caption: String,
            isPrimary: {
                type: Boolean,
                default: false,
            },
        }],

        videos: [{
            public_id: String,
            url: String,
            caption: String,
        }],

        // Business Analytics
        analytics: {
            views: {
                type: Number,
                default: 0,
            },
            calls: {
                type: Number,
                default: 0,
            },
            websiteClicks: {
                type: Number,
                default: 0,
            },
            directionsRequested: {
                type: Number,
                default: 0,
            },
            totalViews: {
                type: Number,
                default: 0,
            },
            totalCalls: {
                type: Number,
                default: 0,
            },
            totalDirections: {
                type: Number,
                default: 0,
            },
            totalWebsiteClicks: {
                type: Number,
                default: 0,
            },
            monthlyViews: {
                type: Number,
                default: 0,
            },
            lastViewedAt: {
                type: Date,
            },
        },

        // SEO and Keywords
        keywords: [{
            type: String,
            trim: true,
        }],

        tags: [{
            type: String,
            trim: true,
        }],

        // Business Status
        status: {
            type: String,
            enum: ['active', 'inactive', 'pending', 'suspended'],
            default: 'pending',
        },

        // Premium Features
        isPremium: {
            type: Boolean,
            default: false,
        },

        premiumFeatures: {
            featuredListing: {
                type: Boolean,
                default: false,
            },
            prioritySupport: {
                type: Boolean,
                default: false,
            },
            analyticsAccess: {
                type: Boolean,
                default: false,
            },
            customBranding: {
                type: Boolean,
                default: false,
            },
        },

        // Owner/Vendor Information
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },

        // Additional Information
        establishedYear: {
            type: Number,
            min: 1900,
            max: new Date().getFullYear(),
        },

        employeeCount: {
            type: String,
            enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
        },

        // Special Offers
        offers: [{
            title: String,
            description: String,
            validTill: Date,
            discountPercentage: Number,
            isActive: {
                type: Boolean,
                default: true,
            },
        }],
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for checking if business is currently open
businessSchema.virtual('isCurrentlyOpen').get(function() {
    const now = new Date();
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDay = days[now.getDay()];
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
    
    const todayHours = this.businessHours[currentDay];
    if (!todayHours || todayHours.isClosed) return false;
    
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
});

// Index for location-based queries
businessSchema.index({ "coordinates.latitude": 1, "coordinates.longitude": 1 });
businessSchema.index({ location: '2dsphere' }); // Geospatial index
businessSchema.index({ category: 1, businessType: 1 });
businessSchema.index({ "address.city": 1, "address.area": 1 });
businessSchema.index({ keywords: 1 });
// businessSchema.index({ tags: 1 }); // Commented to avoid parallel array indexing issue
businessSchema.index({ "ratings.average": -1 });
businessSchema.index({ status: 1, isPremium: -1 });

// Pre-save middleware to sync coordinates with location
businessSchema.pre('save', function(next) {
    if (this.coordinates && this.coordinates.latitude && this.coordinates.longitude) {
        this.location = {
            type: 'Point',
            coordinates: [this.coordinates.longitude, this.coordinates.latitude]
        };
    }
    next();
});

module.exports = mongoose.model("Business", businessSchema);
