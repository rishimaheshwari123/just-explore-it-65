const mongoose = require('mongoose');
const Business = require('./models/businessModel');
const Vendor = require('./models/vendorModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://infoinextets:VWi8V6YTnxIgESpW@cluster0.3doac7y.mongodb.net/business-guruji');

const createSampleBusinesses = async () => {
    try {
        // Find existing vendor or create one
        let vendor = await Vendor.findOne({ email: "rajesh.kumar@example.com" });
        
        if (!vendor) {
            const vendorData = {
                name: "Rajesh Kumar",
                email: "rajesh.kumar@example.com",
                phone: "+91-9876543200",
                password: "password123",
                ownerDetails: {
                    firstName: "Rajesh",
                    lastName: "Kumar",
                    gender: "Male"
                },
                company: "Kumar Business Solutions",
                address: {
                    street: "123 Business Street",
                    area: "Central Delhi",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110001"
                },
                status: "active"
            };
            
            vendor = new Vendor(vendorData);
            await vendor.save();
            console.log('✅ Created vendor:', vendor.name);
        } else {
            console.log('✅ Found existing vendor:', vendor.name);
        }
        
        const vendorId = vendor._id;
        
        // Clear existing businesses
        await Business.deleteMany({});
        console.log('🗑️ Cleared existing businesses');
        
        // Create sample businesses
        const sampleBusinesses = [
            {
                businessName: "Sharma Restaurant & Dhaba",
                businessType: "Restaurant",
                category: "Food & Dining",
                subCategory: "North Indian",
                description: "Authentic North Indian cuisine with traditional flavors. Famous for butter chicken, dal makhani, and fresh naan bread.",
                contactInfo: {
                    primaryPhone: "+91-9876543210",
                    secondaryPhone: "+91-9876543211",
                    whatsappNumber: "+91-9876543210",
                    email: "info@sharmarestaurant.com",
                    website: "www.sharmarestaurant.com"
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
                location: {
                    type: "Point",
                    coordinates: [77.2167, 28.6315] // [longitude, latitude]
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
                ratings: {
                    average: 4.5,
                    totalReviews: 125,
                    breakdown: {
                        five: 75,
                        four: 35,
                        three: 10,
                        two: 3,
                        one: 2
                    }
                },
                features: ["WiFi Available", "Parking Available", "AC Available", "Card Payment Accepted", "Home Delivery"],
                images: [
                    { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", isPrimary: true },
                    { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", isPrimary: false }
                ],
                keywords: ["restaurant", "north indian", "butter chicken", "dal makhani", "naan"],
                tags: ["family restaurant", "authentic food", "cozy ambiance"],
                status: "active",
                vendor: vendorId
            },
            {
                businessName: "City Hospital & Medical Center",
                businessType: "Hospital",
                category: "Healthcare",
                subCategory: "Multi-specialty",
                description: "Leading multi-specialty hospital with 24/7 emergency services, experienced doctors, and modern medical equipment.",
                contactInfo: {
                    primaryPhone: "+91-9876543220",
                    secondaryPhone: "+91-9876543221",
                    email: "info@cityhospital.com",
                    website: "www.cityhospital.com"
                },
                address: {
                    street: "456 Medical Complex",
                    area: "Karol Bagh",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110005",
                    landmark: "Near Karol Bagh Metro"
                },
                area: "Karol Bagh",
                coordinates: {
                    latitude: 28.6519,
                    longitude: 77.1909
                },
                location: {
                    type: "Point",
                    coordinates: [77.1909, 28.6519] // [longitude, latitude]
                },
                businessHours: {
                    monday: { open: "00:00", close: "23:59", isClosed: false },
                    tuesday: { open: "00:00", close: "23:59", isClosed: false },
                    wednesday: { open: "00:00", close: "23:59", isClosed: false },
                    thursday: { open: "00:00", close: "23:59", isClosed: false },
                    friday: { open: "00:00", close: "23:59", isClosed: false },
                    saturday: { open: "00:00", close: "23:59", isClosed: false },
                    sunday: { open: "00:00", close: "23:59", isClosed: false }
                },
                services: [
                    {
                        name: "General Consultation",
                        description: "General physician consultation",
                        price: {
                            min: 500,
                            max: 500,
                            currency: "INR",
                            priceType: "fixed"
                        }
                    },
                    {
                        name: "Emergency Services",
                        description: "24/7 emergency medical services",
                        price: {
                            min: 1000,
                            max: 5000,
                            currency: "INR",
                            priceType: "range"
                        }
                    }
                ],
                priceRange: "₹₹₹",
                ratings: {
                    average: 4.2,
                    totalReviews: 89,
                    breakdown: {
                        five: 45,
                        four: 30,
                        three: 10,
                        two: 3,
                        one: 1
                    }
                },
                features: ["24/7 Service", "Emergency Service", "Parking Available", "Wheelchair Accessible", "Expert Staff"],
                images: [
                    { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400", isPrimary: true },
                    { url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400", isPrimary: false }
                ],
                keywords: ["hospital", "medical center", "emergency", "doctors", "healthcare"],
                tags: ["multi-specialty", "24/7 service", "experienced doctors"],
                status: "active",
                vendor: vendorId
            },
            {
                businessName: "Tech Solutions Academy",
                businessType: "School",
                category: "Education",
                subCategory: "Computer Training",
                description: "Professional computer training institute offering courses in programming, web development, and digital marketing.",
                contactInfo: {
                    primaryPhone: "+91-9876543230",
                    email: "info@techsolutions.com",
                    website: "www.techsolutions.com"
                },
                address: {
                    street: "789 Education Hub",
                    area: "Lajpat Nagar",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110024",
                    landmark: "Near Lajpat Nagar Metro"
                },
                area: "Lajpat Nagar",
                coordinates: {
                    latitude: 28.5665,
                    longitude: 77.2431
                },
                location: {
                    type: "Point",
                    coordinates: [77.2431, 28.5665] // [longitude, latitude]
                },
                businessHours: {
                    monday: { open: "09:00", close: "18:00", isClosed: false },
                    tuesday: { open: "09:00", close: "18:00", isClosed: false },
                    wednesday: { open: "09:00", close: "18:00", isClosed: false },
                    thursday: { open: "09:00", close: "18:00", isClosed: false },
                    friday: { open: "09:00", close: "18:00", isClosed: false },
                    saturday: { open: "09:00", close: "16:00", isClosed: false },
                    sunday: { open: "00:00", close: "00:00", isClosed: true }
                },
                services: [
                    {
                        name: "Web Development Course",
                        description: "Complete web development training",
                        price: {
                            min: 15000,
                            max: 15000,
                            currency: "INR",
                            priceType: "fixed"
                        }
                    },
                    {
                        name: "Digital Marketing Course",
                        description: "Comprehensive digital marketing training",
                        price: {
                            min: 12000,
                            max: 12000,
                            currency: "INR",
                            priceType: "fixed"
                        }
                    }
                ],
                priceRange: "₹₹",
                ratings: {
                    average: 4.7,
                    totalReviews: 156,
                    breakdown: {
                        five: 120,
                        four: 25,
                        three: 8,
                        two: 2,
                        one: 1
                    }
                },
                features: ["WiFi Available", "AC Available", "Online Booking", "Expert Staff", "Quality Assured"],
                images: [
                    { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400", isPrimary: true },
                    { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400", isPrimary: false }
                ],
                keywords: ["computer training", "web development", "programming", "digital marketing"],
                tags: ["professional training", "job oriented", "experienced faculty"],
                status: "active",
                vendor: vendorId
            },
            {
                businessName: "Fashion Plaza Mall",
                businessType: "Shopping Mall",
                category: "Shopping",
                subCategory: "Fashion & Lifestyle",
                description: "Premium shopping destination with top fashion brands, food court, and entertainment options.",
                contactInfo: {
                    primaryPhone: "+91-9876543240",
                    email: "info@fashionplaza.com",
                    website: "www.fashionplaza.com"
                },
                address: {
                    street: "101 Shopping District",
                    area: "Rajouri Garden",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110027",
                    landmark: "Near Rajouri Garden Metro"
                },
                area: "Rajouri Garden",
                coordinates: {
                    latitude: 28.6469,
                    longitude: 77.1200
                },
                location: {
                    type: "Point",
                    coordinates: [77.1200, 28.6469] // [longitude, latitude]
                },
                businessHours: {
                    monday: { open: "10:00", close: "22:00", isClosed: false },
                    tuesday: { open: "10:00", close: "22:00", isClosed: false },
                    wednesday: { open: "10:00", close: "22:00", isClosed: false },
                    thursday: { open: "10:00", close: "22:00", isClosed: false },
                    friday: { open: "10:00", close: "22:00", isClosed: false },
                    saturday: { open: "10:00", close: "23:00", isClosed: false },
                    sunday: { open: "10:00", close: "23:00", isClosed: false }
                },
                services: [
                    {
                        name: "Shopping",
                        description: "Wide range of fashion and lifestyle brands",
                        price: {
                            min: 500,
                            max: 50000,
                            currency: "INR",
                            priceType: "range"
                        }
                    },
                    {
                        name: "Food Court",
                        description: "Multiple dining options",
                        price: {
                            min: 200,
                            max: 1500,
                            currency: "INR",
                            priceType: "range"
                        }
                    }
                ],
                priceRange: "₹₹₹",
                ratings: {
                    average: 4.3,
                    totalReviews: 234,
                    breakdown: {
                        five: 145,
                        four: 65,
                        three: 18,
                        two: 4,
                        one: 2
                    }
                },
                features: ["Parking Available", "AC Available", "WiFi Available", "Card Payment Accepted", "Wheelchair Accessible"],
                images: [
                    { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400", isPrimary: true },
                    { url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400", isPrimary: false }
                ],
                keywords: ["shopping mall", "fashion", "brands", "food court", "entertainment"],
                tags: ["premium shopping", "family destination", "top brands"],
                status: "active",
                vendor: vendorId
            },
            {
                businessName: "Grand Palace Hotel",
                businessType: "Hotel",
                category: "Hotels & Travel",
                subCategory: "Luxury Hotel",
                description: "Luxury hotel with world-class amenities, fine dining, spa services, and conference facilities.",
                contactInfo: {
                    primaryPhone: "+91-9876543250",
                    email: "reservations@grandpalace.com",
                    website: "www.grandpalace.com"
                },
                address: {
                    street: "555 Hotel Avenue",
                    area: "Aerocity",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110037",
                    landmark: "Near IGI Airport"
                },
                area: "Aerocity",
                coordinates: {
                    latitude: 28.5562,
                    longitude: 77.1180
                },
                location: {
                    type: "Point",
                    coordinates: [77.1180, 28.5562] // [longitude, latitude]
                },
                businessHours: {
                    monday: { open: "00:00", close: "23:59", isClosed: false },
                    tuesday: { open: "00:00", close: "23:59", isClosed: false },
                    wednesday: { open: "00:00", close: "23:59", isClosed: false },
                    thursday: { open: "00:00", close: "23:59", isClosed: false },
                    friday: { open: "00:00", close: "23:59", isClosed: false },
                    saturday: { open: "00:00", close: "23:59", isClosed: false },
                    sunday: { open: "00:00", close: "23:59", isClosed: false }
                },
                services: [
                    {
                        name: "Deluxe Room",
                        description: "Comfortable deluxe room with modern amenities",
                        price: {
                            min: 8000,
                            max: 8000,
                            currency: "INR",
                            priceType: "fixed"
                        }
                    },
                    {
                        name: "Suite Room",
                        description: "Luxury suite with premium facilities",
                        price: {
                            min: 15000,
                            max: 15000,
                            currency: "INR",
                            priceType: "fixed"
                        }
                    }
                ],
                priceRange: "₹₹₹₹",
                ratings: {
                    average: 4.6,
                    totalReviews: 312,
                    breakdown: {
                        five: 220,
                        four: 70,
                        three: 15,
                        two: 5,
                        one: 2
                    }
                },
                features: ["WiFi Available", "Parking Available", "AC Available", "24/7 Service", "Card Payment Accepted"],
                images: [
                    { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", isPrimary: true },
                    { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400", isPrimary: false }
                ],
                keywords: ["luxury hotel", "airport hotel", "conference", "spa", "fine dining"],
                tags: ["luxury accommodation", "business hotel", "world-class amenities"],
                status: "active",
                vendor: vendorId
            },
            {
                businessName: "Green Valley Gym & Fitness",
                businessType: "Gym",
                category: "Sports & Recreation",
                subCategory: "Fitness Center",
                description: "Modern fitness center with latest equipment, personal trainers, and group fitness classes.",
                contactInfo: {
                    primaryPhone: "+91-9876543250",
                    email: "info@greenvalleygym.com",
                    website: "www.greenvalleygym.com"
                },
                address: {
                    street: "789 Fitness Street",
                    area: "Lajpat Nagar",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110024",
                    landmark: "Near Sports Complex"
                },
                area: "Lajpat Nagar",
                coordinates: {
                    latitude: 28.5665,
                    longitude: 77.2431
                },
                location: {
                    type: "Point",
                    coordinates: [77.2431, 28.5665]
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
                        description: "Full access to gym equipment and group classes",
                        price: {
                            min: 2000,
                            max: 5000,
                            currency: "INR",
                            priceType: "range"
                        }
                    }
                ],
                priceRange: "₹₹",
                ratings: {
                    average: 4.3,
                    totalReviews: 89,
                    breakdown: {
                        five: 45,
                        four: 30,
                        three: 10,
                        two: 3,
                        one: 1
                    }
                },
                features: ["WiFi Available", "Parking Available", "AC Available", "Card Payment Accepted", "Expert Staff"],
                images: [
                    { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400", isPrimary: true }
                ],
                keywords: ["gym", "fitness", "workout", "personal trainer", "group classes"],
                tags: ["fitness center", "modern equipment", "professional trainers"],
                status: "active",
                vendor: vendorId
            },
            {
                businessName: "BookWorm Library & Cafe",
                businessType: "Library Cafe",
                category: "Education",
                subCategory: "Library",
                description: "Cozy library cafe with extensive book collection, study spaces, and freshly brewed coffee.",
                contactInfo: {
                    primaryPhone: "+91-9876543260",
                    email: "info@bookwormlibrary.com"
                },
                address: {
                    street: "321 Knowledge Lane",
                    area: "Khan Market",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110003",
                    landmark: "Near Khan Market Metro"
                },
                area: "Khan Market",
                coordinates: {
                    latitude: 28.5984,
                    longitude: 77.2319
                },
                location: {
                    type: "Point",
                    coordinates: [77.2319, 28.5984]
                },
                businessHours: {
                    monday: { open: "08:00", close: "21:00", isClosed: false },
                    tuesday: { open: "08:00", close: "21:00", isClosed: false },
                    wednesday: { open: "08:00", close: "21:00", isClosed: false },
                    thursday: { open: "08:00", close: "21:00", isClosed: false },
                    friday: { open: "08:00", close: "21:00", isClosed: false },
                    saturday: { open: "09:00", close: "20:00", isClosed: false },
                    sunday: { open: "09:00", close: "20:00", isClosed: false }
                },
                services: [
                    {
                        name: "Study Space Rental",
                        description: "Quiet study spaces with WiFi and power outlets",
                        price: {
                            min: 100,
                            max: 300,
                            currency: "INR",
                            priceType: "range"
                        }
                    }
                ],
                priceRange: "₹",
                ratings: {
                    average: 4.6,
                    totalReviews: 67,
                    breakdown: {
                        five: 42,
                        four: 18,
                        three: 5,
                        two: 1,
                        one: 1
                    }
                },
                features: ["WiFi Available", "AC Available", "Card Payment Accepted", "Free Consultation", "Expert Staff"],
                images: [
                    { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", isPrimary: true }
                ],
                keywords: ["library", "books", "study", "cafe", "reading"],
                tags: ["study space", "book lovers", "quiet cafe"],
                status: "active",
                vendor: vendorId
            },
            {
                businessName: "Auto Care Service Center",
                businessType: "Service Center",
                category: "Automotive",
                subCategory: "Car Service",
                description: "Professional car service center with experienced mechanics and genuine spare parts.",
                contactInfo: {
                    primaryPhone: "+91-9876543270",
                    email: "info@autocareservice.com"
                },
                address: {
                    street: "567 Service Road",
                    area: "Mayur Vihar",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110091",
                    landmark: "Near Mayur Vihar Metro"
                },
                area: "Mayur Vihar",
                coordinates: {
                    latitude: 28.6089,
                    longitude: 77.2953
                },
                location: {
                    type: "Point",
                    coordinates: [77.2953, 28.6089]
                },
                businessHours: {
                    monday: { open: "09:00", close: "19:00", isClosed: false },
                    tuesday: { open: "09:00", close: "19:00", isClosed: false },
                    wednesday: { open: "09:00", close: "19:00", isClosed: false },
                    thursday: { open: "09:00", close: "19:00", isClosed: false },
                    friday: { open: "09:00", close: "19:00", isClosed: false },
                    saturday: { open: "09:00", close: "18:00", isClosed: false },
                    sunday: { open: "10:00", close: "17:00", isClosed: false }
                },
                services: [
                    {
                        name: "General Service",
                        description: "Complete car checkup and maintenance",
                        price: {
                            min: 1500,
                            max: 5000,
                            currency: "INR",
                            priceType: "range"
                        }
                    }
                ],
                priceRange: "₹₹",
                ratings: {
                    average: 4.2,
                    totalReviews: 156,
                    breakdown: {
                        five: 78,
                        four: 52,
                        three: 18,
                        two: 6,
                        one: 2
                    }
                },
                features: ["Parking Available", "Card Payment Accepted", "Warranty Available", "Expert Staff", "Quality Assured"],
                images: [
                    { url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400", isPrimary: true }
                ],
                keywords: ["car service", "auto repair", "mechanics", "spare parts", "maintenance"],
                tags: ["professional service", "trusted mechanics", "quality parts"],
                status: "active",
                vendor: vendorId
            },
            {
                businessName: "Fresh Mart Grocery Store",
                businessType: "Grocery Store",
                category: "Shopping",
                subCategory: "Grocery",
                description: "Fresh groceries, vegetables, fruits, and daily essentials at competitive prices.",
                contactInfo: {
                    primaryPhone: "+91-9876543280",
                    email: "info@freshmart.com"
                },
                address: {
                    street: "890 Market Street",
                    area: "Rohini",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110085",
                    landmark: "Near Rohini Metro Station"
                },
                area: "Rohini",
                coordinates: {
                    latitude: 28.7041,
                    longitude: 77.1025
                },
                location: {
                    type: "Point",
                    coordinates: [77.1025, 28.7041]
                },
                businessHours: {
                    monday: { open: "07:00", close: "22:00", isClosed: false },
                    tuesday: { open: "07:00", close: "22:00", isClosed: false },
                    wednesday: { open: "07:00", close: "22:00", isClosed: false },
                    thursday: { open: "07:00", close: "22:00", isClosed: false },
                    friday: { open: "07:00", close: "22:00", isClosed: false },
                    saturday: { open: "07:00", close: "22:00", isClosed: false },
                    sunday: { open: "07:00", close: "22:00", isClosed: false }
                },
                services: [
                    {
                        name: "Home Delivery",
                        description: "Free home delivery for orders above ₹500",
                        price: {
                            min: 0,
                            max: 50,
                            currency: "INR",
                            priceType: "range"
                        }
                    }
                ],
                priceRange: "₹",
                ratings: {
                    average: 4.4,
                    totalReviews: 203,
                    breakdown: {
                        five: 112,
                        four: 65,
                        three: 20,
                        two: 4,
                        one: 2
                    }
                },
                features: ["Home Delivery", "Card Payment Accepted", "Cash on Delivery", "Quality Assured", "Return Policy"],
                images: [
                    { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", isPrimary: true }
                ],
                keywords: ["grocery", "fresh vegetables", "fruits", "daily essentials", "home delivery"],
                tags: ["fresh produce", "competitive prices", "convenient shopping"],
                status: "active",
                vendor: vendorId
            }
        ];
        
        // Insert all businesses
        const createdBusinesses = await Business.insertMany(sampleBusinesses);
        console.log(`✅ Created ${createdBusinesses.length} sample businesses:`);
        
        createdBusinesses.forEach((business, index) => {
            console.log(`${index + 1}. ${business.businessName} (${business.category})`);
        });
        
        console.log('\n🎉 Sample data creation completed successfully!');
        
    } catch (error) {
        console.error('❌ Error creating sample businesses:', error);
    } finally {
        mongoose.connection.close();
    }
};

createSampleBusinesses();