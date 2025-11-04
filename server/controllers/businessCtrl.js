const Business = require('../models/businessModel');
const Vendor = require('../models/vendorModel');
const { uploadImageToCloudinary } = require('../config/imageUploader');

// Create Business
const createBusinessCtrl = async (req, res) => {
    try {
        console.log("📩 Incoming Body =>", req.body);

        // Parse businessData
        let businessData;
        if (req.body.businessData) {
            try {
                businessData = JSON.parse(req.body.businessData);
            } catch (err) {
                console.error("❌ Error parsing businessData:", err.message);
                return res.status(400).json({
                    success: false,
                    message: "Invalid businessData format",
                });
            }
        } else {
            businessData = req.body;
        }

        console.log("📝 Parsed BusinessData =>", businessData);

        const {
            businessName,
            description,
            category,
            subCategory,
            businessType,
            establishedYear,
            employeeCount,
            address,
            area,
            coordinates,
            phone,
            alternatePhone,
            whatsappNumber,
            email,
            website,
            socialMedia,
            businessHours,
            services,
            pricing,
            tags,
            keywords,
            features,
            paymentMethods,
            amenities,
            priceRange,
            vendor,
        } = businessData;
        // ========== HANDLE FILE UPLOAD ==========
        const uploadedImages = [];
        if (req.files && req.files.images) {
            const files = Array.isArray(req.files.images)
                ? req.files.images
                : [req.files.images];

            for (const file of files) {
                try {
                    const result = await uploadImageToCloudinary(file, "businesses", 600, 80);
                    uploadedImages.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                        isPrimary: uploadedImages.length === 0, // first one primary
                    });
                } catch (uploadError) {
                    console.error("❌ Error uploading image:", uploadError);
                }
            }
        }

        // ========== PARSE IMAGES ==========
        let images = [...uploadedImages];
        if (req.body.images) {
            try {
                const parsedImages =
                    typeof req.body.images === "string"
                        ? JSON.parse(req.body.images)
                        : req.body.images;

                if (Array.isArray(parsedImages)) {
                    images = [
                        ...images,
                        ...parsedImages.map((img, i) =>
                            typeof img === "string"
                                ? { url: img, isPrimary: images.length === 0 && i === 0 }
                                : img
                        ),
                    ];
                }
            } catch (e) {
                console.error("❌ Error parsing images:", e.message);
            }
        }
        console.log("📸 Final Images Array =>", images);

        // ========== PARSE VIDEOS ==========
        let videos = [];
        if (req.body.videos) {
            try {
                const parsedVideos =
                    typeof req.body.videos === "string"
                        ? JSON.parse(req.body.videos)
                        : req.body.videos;

                if (Array.isArray(parsedVideos)) {
                    videos = parsedVideos.map((vid) =>
                        typeof vid === "string" ? { url: vid } : vid
                    );
                }
            } catch (e) {
                console.error("❌ Error parsing videos:", e.message);
            }
        }
        console.log("🎬 Final Videos Array =>", videos);

        // ========== PARSE SERVICES ==========
        let servicesArray = [];
        if (services) {
            try {
                servicesArray = Array.isArray(services)
                    ? services
                    : JSON.parse(services);
            } catch {
                servicesArray = [];
            }
        }

        // ========== PARSE PRICING ==========
        let pricingArray = [];
        if (pricing) {
            try {
                pricingArray = Array.isArray(pricing) ? pricing : JSON.parse(pricing);
            } catch {
                pricingArray = [];
            }
        }

        console.log("🛠 Services Array =>", servicesArray);
        console.log("💰 Pricing Array =>", pricingArray);

        // ========== VALIDATIONS ==========
        if (!businessName || !description || !category || !phone || !address || !vendor) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide all required fields: businessName, description, category, phone, address, vendor",
            });
        }

        if (!address.street || !address.city || !address.state || !address.pincode) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide complete address: street, city, state, pincode",
            });
        }

        if (
            !coordinates ||
            !coordinates.latitude ||
            !coordinates.longitude ||
            coordinates.latitude === 0 ||
            coordinates.longitude === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide valid coordinates (latitude and longitude cannot be 0)",
            });
        }

        const vendorExists = await Vendor.findById(vendor);
        if (!vendorExists) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        // ========== CREATE BUSINESS ==========
        const business = await Business.create({
            businessName,
            description,
            category,
            subCategory,
            businessType: businessType || "Other",
            establishedYear,
            employeeCount,
            contactInfo: {
                primaryPhone: phone,
                secondaryPhone: alternatePhone,
                email,
                website,
                whatsappNumber,
                socialMedia: socialMedia || {},
            },
            address: {
                street: address.street,
                area: address.area || area || "Unknown Area",
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                landmark: address.landmark,
            },
            area: address.area || area || "Unknown Area",
            coordinates: {
                latitude: parseFloat(coordinates?.latitude) || 0,
                longitude: parseFloat(coordinates?.longitude) || 0,
            },
            businessHours: businessHours,
            services: servicesArray,
            priceRange: priceRange || "₹₹",
            images,
            videos,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [],
            keywords: keywords ? (Array.isArray(keywords) ? keywords : keywords.split(",")) : [],
            features: features || [],
            paymentMethods: paymentMethods || [],
            amenities: amenities || [],
            vendor,
            status: 'pending',
        });

        await Vendor.findByIdAndUpdate(vendor, {
            $inc: { "analytics.totalBusinesses": 1 },
        });

        return res.status(201).json({
            success: true,
            message: "Business created and set to pending. Complete subscription payment to list.",
            business,
        });
    } catch (error) {
        console.error("❌ Error creating business:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating business API!",
            error: error.message,
        });
    }
};





// Update Business
const updateBusinessCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("📥 Incoming Body =>", req.body);

        const {
            businessName,
            description,
            category,
            subCategory,
            businessType,
            establishedYear,
            employeeCount,
            address,
            area,
            coordinates,
            contactInfo,
            businessHours,
            services,
            features,
            tags,
            keywords,
            paymentMethods,
            amenities,
            images,
            priceRange,
            vendor,
        } = req.body;

        // Find business
        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        // ✅ Normalize Images
        let imagesArray = [];
        if (images) {
            if (typeof images === "string") {
                try {
                    imagesArray = JSON.parse(images);
                } catch {
                    imagesArray = [images];
                }
            } else {
                imagesArray = images;
            }

            imagesArray = imagesArray.map((img, i) => {
                if (typeof img === "string") {
                    return { url: img, isPrimary: i === 0 };
                }
                return img;
            });
        }

        console.log("📸 Final Images =>", imagesArray);

        // Validate coordinates
        if (
            coordinates &&
            coordinates.latitude !== undefined &&
            coordinates.longitude !== undefined
        ) {
            if (coordinates.latitude === 0 || coordinates.longitude === 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please provide valid coordinates (latitude and longitude cannot be 0)",
                });
            }
        }

        // Prepare update data
        const updateData = {
            ...(businessName && { businessName }),
            ...(description && { description }),
            ...(category && { category }),
            ...(subCategory && { subCategory }),
            ...(businessType && { businessType }),
            ...(establishedYear && { establishedYear }),
            ...(employeeCount && { employeeCount }),
            ...(address && { address }),
            ...(contactInfo && { contactInfo }),
            ...(priceRange && { priceRange }),
            ...(area && { area }),
            ...(coordinates && {
                location: {
                    type: "Point",
                    coordinates: [coordinates.longitude, coordinates.latitude],
                },
                coordinates,
            }),
            ...(businessHours && { businessHours }),
            ...(services && services.length > 0 && { services }),
            ...(features && features.length > 0 && { features }),
            ...(tags && tags.length > 0 && { tags }),
            ...(keywords && keywords.length > 0 && { keywords }),
            ...(paymentMethods && paymentMethods.length > 0 && { paymentMethods }),
            ...(amenities && amenities.length > 0 && { amenities }),
            ...(imagesArray.length > 0 && { images: imagesArray }),
            ...(vendor && { vendor }),
        };

        console.log("🛠 UpdateData =>", updateData);

        // Update business with new data
        const updatedBusiness = await Business.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate("vendor", "name email company");

        return res.status(200).json({
            success: true,
            message: "Business updated successfully!",
            business: updatedBusiness,
        });
    } catch (error) {
        console.error("❌ Error updating business:", error);
        return res.status(500).json({
            success: false,
            message: "Error in updating business API!",
            error: error.message,
        });
    }
};

// Get All Businesses with Filters
const getBusinessesCtrl = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            city,
            state,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            minRating,
            maxPrice,
            isOpen,
            verified,
            featured,
            latitude,
            longitude,
            distance = 100 // default 10km
        } = req.query;

        // Build filter object
        const filter = { status: 'active' };

        if (category) {
            filter.category = category;
        }

        // console.log('Filter object:', filter);
        // console.log('Category parameter:', category);

        if (city || state) {
            const addressQueries = [];
            const cityParts = city ? city.split(',').map(part => part.trim()) : [];
            const stateParts = state ? state.split(',').map(part => part.trim()) : [];

            // Add city-related searches
            cityParts.forEach(part => {
                addressQueries.push(
                    { 'address.street': new RegExp(part, 'i') },
                    { 'address.area': new RegExp(part, 'i') },
                    { 'address.city': new RegExp(part, 'i') },
                    { 'address.state': new RegExp(part, 'i') }
                );
            });

            // Add state-related searches
            stateParts.forEach(part => {
                addressQueries.push(
                    { 'address.street': new RegExp(part, 'i') },
                    { 'address.area': new RegExp(part, 'i') },
                    { 'address.city': new RegExp(part, 'i') },
                    { 'address.state': new RegExp(part, 'i') }
                );
            });

            if (addressQueries.length > 0) {
                filter.$or = filter.$or ? filter.$or.concat(addressQueries) : addressQueries;
            }
        }


        if (search) {
            // Split search term into individual keywords for partial matching
            const searchKeywords = search.toLowerCase().split(/\s+/).filter(keyword => keyword.length > 0);

            // Create search conditions for each keyword
            const searchConditions = [];

            searchKeywords.forEach(keyword => {
                const keywordRegex = new RegExp(keyword, 'i');
                searchConditions.push({
                    $or: [
                        { businessName: keywordRegex },
                        { description: keywordRegex },
                        { tags: keywordRegex },
                        { keywords: keywordRegex },
                        { category: keywordRegex },
                        { 'address.street': keywordRegex },
                        { 'address.area': keywordRegex },
                        { 'address.city': keywordRegex },
                        { 'address.state': keywordRegex },
                        { 'address.pincode': keywordRegex }
                    ]
                });
            });

            // If multiple keywords, match any of them (OR logic)
            if (searchConditions.length > 0) {
                filter.$or = filter.$or ? filter.$or.concat(searchConditions) : searchConditions;
            }
        }




        if (minRating) {
            filter['ratings.average'] = { $gte: parseFloat(minRating) };
        }

        if (verified === 'true') {
            filter['verification.isVerified'] = true;
        }

        if (featured === 'true') {
            filter['premiumFeatures.featuredListing'] = true;
        }

        // Build sort object with premium business priority
        const sort = {};

        // Always prioritize premium businesses first
        sort['isPremium'] = -1; // Premium businesses first
        sort['currentSubscription.priority'] = -1; // Higher priority first
        sort['currentSubscription.status'] = -1; // Active subscriptions first

        if (sortBy === 'rating') {
            sort['ratings.average'] = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'views') {
            sort['analytics.totalViews'] = sortOrder === 'asc' ? 1 : -1;
        } else {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        console.log('Executing query with filter:', filter);

        let businesses;

        // If latitude and longitude are provided, use geospatial query
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            const distanceInMeters = parseFloat(distance) * 1000; // Convert km to meters

            businesses = await Business.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        distanceField: "distance",
                        maxDistance: distanceInMeters,
                        spherical: true,
                        query: filter
                    }
                },
                {
                    $lookup: {
                        from: "vendors",
                        localField: "vendor",
                        foreignField: "_id",
                        as: "vendor",
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    company: 1,
                                    "verification.verificationLevel": 1
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: {
                        path: "$vendor",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $sort: sortBy === 'distance' ?
                        { isPremium: -1, 'currentSubscription.priority': -1, distance: 1 } :
                        { isPremium: -1, 'currentSubscription.priority': -1, ...sort }
                },
                {
                    $skip: skip
                },
                {
                    $limit: parseInt(limit)
                }
            ]);
        } else {
            businesses = await Business.find(filter)
                .populate('vendor', 'name company verification.verificationLevel')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean();
        }

        console.log('Found businesses:', businesses.length);
        console.log('Business details:', businesses.map(b => ({ name: b.businessName, category: b.category })));

        const total = await Business.countDocuments(filter);
        console.log('Total count:', total);

        return res.status(200).json({
            success: true,
            businesses,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalBusinesses: total,
                hasNext: skip + parseInt(limit) < total,
                hasPrev: parseInt(page) > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching businesses:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching businesses API!",
            error: error.message,
        });
    }
};

// Get Business by ID
const getBusinessByIdCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        const business = await Business.findById(id)
            .populate('vendor', 'name email company phone verification profileImage')
            .lean();

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        // Increment view count
        await Business.findByIdAndUpdate(id, {
            $inc: { 'analytics.totalViews': 1 }
        });

        return res.status(200).json({
            success: true,
            business,
        });
    } catch (error) {
        console.error("Error fetching business:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching business API!",
            error: error.message,
        });
    }
};

// Get Businesses by Vendor
const getBusinessesByVendorCtrl = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const businesses = await Business.find({ vendor: vendorId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Business.countDocuments({ vendor: vendorId });

        return res.status(200).json({
            success: true,
            businesses,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalBusinesses: total,
            },
        });
    } catch (error) {
        console.error("Error fetching vendor businesses:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching vendor businesses API!",
            error: error.message,
        });
    }
};

// Delete Business
const deleteBusinessCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        await Business.findByIdAndDelete(id);

        // Update vendor analytics
        await Vendor.findByIdAndUpdate(business.vendor, {
            $inc: { 'analytics.totalBusinesses': -1 }
        });

        return res.status(200).json({
            success: true,
            message: "Business deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting business:", error);
        return res.status(500).json({
            success: false,
            message: "Error in deleting business API!",
            error: error.message,
        });
    }
};

// Get Featured Businesses
const getFeaturedBusinessesCtrl = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const featuredBusinesses = await Business.find({
            'premiumFeatures.featuredListing': true,
            status: 'active',
            isPremium: true
        })
            .populate('vendor', 'name company verification.verificationLevel')
            .sort({ 'ratings.average': -1, createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        return res.status(200).json({
            success: true,
            businesses: featuredBusinesses,
        });
    } catch (error) {
        console.error("Error fetching featured businesses:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching featured businesses API!",
            error: error.message,
        });
    }
};

// Get Trending Businesses
const getTrendingBusinessesCtrl = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const trendingBusinesses = await Business.find({
            'status.isActive': true
        })
            .populate('vendor', 'name company verification.verificationLevel')
            .sort({
                'analytics.totalViews': -1,
                'analytics.totalCalls': -1,
                'ratings.averageRating': -1
            })
            .limit(parseInt(limit))
            .lean();

        return res.status(200).json({
            success: true,
            businesses: trendingBusinesses,
        });
    } catch (error) {
        console.error("Error fetching trending businesses:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching trending businesses API!",
            error: error.message,
        });
    }
};

// Increment Business Interaction (Call, View, etc.)
const incrementBusinessInteractionCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body; // 'view', 'call', 'inquiry', 'direction'

        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        const updateField = {};
        switch (type) {
            case 'call':
                updateField['analytics.totalCalls'] = 1;
                break;
            case 'inquiry':
                updateField['analytics.totalInquiries'] = 1;
                break;
            case 'direction':
                updateField['analytics.totalDirections'] = 1;
                break;
            default:
                updateField['analytics.totalViews'] = 1;
        }

        await Business.findByIdAndUpdate(id, { $inc: updateField });

        return res.status(200).json({
            success: true,
            message: `Business ${type} incremented successfully!`,
        });
    } catch (error) {
        console.error("Error incrementing business interaction:", error);
        return res.status(500).json({
            success: false,
            message: "Error in incrementing business interaction API!",
            error: error.message,
        });
    }
};

// Business interaction tracking controller
const trackBusinessInteractionCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body; // 'call', 'direction', 'view', 'website'

        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found'
            });
        }

        // Update analytics based on interaction type
        const updateField = {};
        switch (type) {
            case 'call':
                updateField['analytics.totalCalls'] = 1;
                break;
            case 'view':
                updateField['analytics.totalViews'] = 1;
                break;
            case 'direction':
                updateField['analytics.totalDirections'] = 1;
                break;
            case 'website':
                updateField['analytics.totalWebsiteClicks'] = 1;
                break;
        }

        await Business.findByIdAndUpdate(id, { $inc: updateField });

        res.status(200).json({
            success: true,
            message: 'Interaction tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking interaction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track interaction',
            error: error.message
        });
    }
};

// Get Properties by Vendor (POST version for legacy compatibility)
const getPropertiesByVendorPost = async (req, res) => {
    try {
        const { vendor } = req.body;
        const { page = 1, limit = 10 } = req.query;

        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Vendor ID is required",
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const properties = await Business.find({ vendor: vendor })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Business.countDocuments({ vendor: vendor });

        return res.status(200).json({
            success: true,
            properties,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalProperties: total,
            },
        });
    } catch (error) {
        console.error("Error fetching vendor properties:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching vendor properties API!",
            error: error.message,
        });
    }
};

module.exports = {
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
    getPropertiesByVendorPost,

    // Legacy exports for backward compatibility
    createPropertyCtrl: createBusinessCtrl,
    updatePropertyCtrl: updateBusinessCtrl,
    getPropertiesCtrl: getBusinessesCtrl,
    getPropertiesByIdCtrl: getBusinessByIdCtrl,
    getPropertiesByVendor: getPropertiesByVendorPost,
    deletePropertyCtrl: deleteBusinessCtrl,
    incrementPropertyViewCtrl: incrementBusinessInteractionCtrl,
};
