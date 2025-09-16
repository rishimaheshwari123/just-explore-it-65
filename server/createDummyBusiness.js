const mongoose = require('mongoose');
const Business = require('./models/businessModel');
const Vendor = require('./models/vendorModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://infoinextets:VWi8V6YTnxIgESpW@cluster0.3doac7y.mongodb.net/business-guruji', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const createDummyBusiness = async () => {
    try {
        const vendorId = '68c10c881b9aff6e9b853fd5';
        
        // Check if vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            console.log('Vendor not found with ID:', vendorId);
            return;
        }
        
        console.log('Found vendor:', vendor.name);
        
        // Sample businesses with proper coordinates
        const sampleBusinesses = [
            {
                businessName: "Sharma Restaurant & Dhaba",
                businessType: "Restaurant",
                category: "Food & Dining",
                subCategory: "North Indian",
                description: "Authentic North Indian cuisine with traditional flavors. Famous for butter chicken, dal makhani, and fresh naan bread. Family-friendly restaurant with cozy ambiance.",
                contactInfo: {
                    primaryPhone: "+91-9876543210",
                    secondaryPhone: "+91-9876543211",
                    whatsappNumber: "+91-9876543210",
                    email: "info@sharmarestaurant.com",
                    website: "www.sharmarestaurant.com",
                    socialMedia: {
                        facebook: "facebook.com/sharmarestaurant",
                        instagram: "instagram.com/sharmarestaurant",
                        twitter: "twitter.com/sharmarestaurant"
                    }
                },
                address: {
                    street: "123 Main Market Road",
                    area: "Connaught Place",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110001",
                    landmark: "Near Metro Station"
                },
                area: "Connaught Place",
                coordinates: {
                    latitude: 28.6315,
                    longitude: 77.2167
                },
                businessHours: {
                    monday: { open: "09:00", close: "22:00", isClosed: false },
                    tuesday: { open: "09:00", close: "22:00", isClosed: false },
                    wednesday: { open: "09:00", close: "22:00", isClosed: false },
                    thursday: { open: "09:00", close: "22:00", isClosed: false },
                    friday: { open: "09:00", close: "22:00", isClosed: false },
                    saturday: { open: "09:00", close: "23:00", isClosed: false },
                    sunday: { open: "09:00", close: "23:00", isClosed: false }
                },
                services: [
                    {
                        name: "Dine-in",
                        description: "Comfortable seating with full menu",
                        price: {
                            min: 200,
                            max: 800,
                            currency: "INR",
                            priceType: "range"
                        }
                    },
                    {
                        name: "Home Delivery",
                        description: "Free delivery within 5km radius",
                        price: {
                            min: 300,
                            max: 1000,
                            currency: "INR",
                            priceType: "range"
                        }
                    }
                ],
                priceRange: "₹₹",
                features: ["WiFi Available", "Parking Available", "AC Available", "Card Payment Accepted", "Home Delivery"],
                keywords: ["restaurant", "north indian", "butter chicken", "dal makhani", "naan", "delhi food"],
                tags: ["family restaurant", "authentic food", "north indian cuisine"],
                vendor: vendorId,
                establishedYear: 2015,
                employeeCount: "11-50",
                status: "active"
            },
            {
                businessName: "TechCare Computer Solutions",
                businessType: "IT Services",
                category: "Electronics & Technology",
                subCategory: "Computer Repair",
                description: "Professional computer repair and IT solutions. Specializing in laptop repair, desktop maintenance, software installation, and network setup. Quick and reliable service.",
                contactInfo: {
                    primaryPhone: "+91-9876543220",
                    secondaryPhone: "+91-9876543221",
                    whatsappNumber: "+91-9876543220",
                    email: "support@techcare.com",
                    website: "www.techcare.com",
                    socialMedia: {
                        facebook: "facebook.com/techcare",
                        instagram: "instagram.com/techcare"
                    }
                },
                address: {
                    street: "456 Tech Hub Complex",
                    area: "Nehru Place",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110019",
                    landmark: "Near Nehru Place Metro"
                },
                area: "Nehru Place",
                coordinates: {
                    latitude: 28.5494,
                    longitude: 77.2501
                },
                businessHours: {
                    monday: { open: "10:00", close: "19:00", isClosed: false },
                    tuesday: { open: "10:00", close: "19:00", isClosed: false },
                    wednesday: { open: "10:00", close: "19:00", isClosed: false },
                    thursday: { open: "10:00", close: "19:00", isClosed: false },
                    friday: { open: "10:00", close: "19:00", isClosed: false },
                    saturday: { open: "10:00", close: "17:00", isClosed: false },
                    sunday: { open: "11:00", close: "16:00", isClosed: false }
                },
                services: [
                    {
                        name: "Laptop Repair",
                        description: "Complete laptop diagnosis and repair",
                        price: {
                            min: 500,
                            max: 5000,
                            currency: "INR",
                            priceType: "range"
                        }
                    },
                    {
                        name: "Software Installation",
                        description: "OS installation and software setup",
                        price: {
                            min: 300,
                            max: 1500,
                            currency: "INR",
                            priceType: "range"
                        }
                    }
                ],
                priceRange: "₹₹",
                features: ["Expert Staff", "Quality Assured", "Warranty Available", "Free Consultation"],
                keywords: ["computer repair", "laptop service", "IT support", "software installation", "nehru place"],
                tags: ["computer service", "IT solutions", "tech support"],
                vendor: vendorId,
                establishedYear: 2018,
                employeeCount: "1-10",
                status: "active"
            },
            {
                businessName: "Green Valley Fitness Center",
                businessType: "Gym",
                category: "Fitness & Wellness",
                subCategory: "Gym & Fitness",
                description: "Modern fitness center with state-of-the-art equipment, personal trainers, and group fitness classes. Clean and spacious facility with AC and music system.",
                contactInfo: {
                    primaryPhone: "+91-9876543230",
                    secondaryPhone: "+91-9876543231",
                    whatsappNumber: "+91-9876543230",
                    email: "info@greenvalleyfitness.com",
                    website: "www.greenvalleyfitness.com",
                    socialMedia: {
                        facebook: "facebook.com/greenvalleyfitness",
                        instagram: "instagram.com/greenvalleyfitness"
                    }
                },
                address: {
                    street: "789 Fitness Street",
                    area: "Lajpat Nagar",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110024",
                    landmark: "Near Central Market"
                },
                area: "Lajpat Nagar",
                coordinates: {
                    latitude: 28.5677,
                    longitude: 77.2431
                },
                businessHours: {
                    monday: { open: "05:00", close: "22:00", isClosed: false },
                    tuesday: { open: "05:00", close: "22:00", isClosed: false },
                    wednesday: { open: "05:00", close: "22:00", isClosed: false },
                    thursday: { open: "05:00", close: "22:00", isClosed: false },
                    friday: { open: "05:00", close: "22:00", isClosed: false },
                    saturday: { open: "06:00", close: "21:00", isClosed: false },
                    sunday: { open: "06:00", close: "21:00", isClosed: false }
                },
                services: [
                    {
                        name: "Monthly Membership",
                        description: "Full gym access with all equipment",
                        price: {
                            min: 2000,
                            max: 2000,
                            currency: "INR",
                            priceType: "fixed"
                        }
                    },
                    {
                        name: "Personal Training",
                        description: "One-on-one training sessions",
                        price: {
                            min: 1000,
                            max: 1000,
                            currency: "INR",
                            priceType: "fixed"
                        }
                    }
                ],
                priceRange: "₹₹",
                features: ["AC Available", "Parking Available", "Expert Staff", "Quality Assured"],
                keywords: ["gym", "fitness", "workout", "personal trainer", "lajpat nagar"],
                tags: ["fitness center", "gym equipment", "health club"],
                vendor: vendorId,
                establishedYear: 2020,
                employeeCount: "11-50",
                status: "active"
            }
        ];
        
        // Create businesses
        for (const businessData of sampleBusinesses) {
            const business = new Business(businessData);
            await business.save();
            console.log(`Created business: ${business.businessName}`);
        }
        
        console.log('\n✅ Successfully created 3 dummy businesses for vendor:', vendor.name);
        console.log('Businesses created:');
        console.log('1. Sharma Restaurant & Dhaba (Food & Dining)');
        console.log('2. TechCare Computer Solutions (IT Services)');
        console.log('3. Green Valley Fitness Center (Fitness)');
        
    } catch (error) {
        console.error('Error creating dummy businesses:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the function
createDummyBusiness();