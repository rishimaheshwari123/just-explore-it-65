const mongoose = require('mongoose');
const Business = require('./models/businessModel');
const Vendor = require('./models/vendorModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample business data
const sampleBusinesses = [
  {
    businessName: 'Sharma Restaurant',
    businessType: 'Restaurant',
    category: 'Food & Dining',
    subCategory: 'North Indian',
    description: 'Authentic North Indian cuisine with traditional flavors and family recipes passed down through generations.',
    contactInfo: {
      primaryPhone: '+91-9876543210',
      secondaryPhone: '+91-9876543211',
      email: 'contact@sharmarestaurant.com',
      website: 'https://sharmarestaurant.com'
    },
    address: {
      street: '123 MG Road',
      area: 'Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      landmark: 'Near Metro Station'
    },
    area: 'Connaught Place',
    coordinates: {
      latitude: 28.6139,
      longitude: 77.2090
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', isPrimary: false }
    ],
    services: [
      { name: 'Dine-in', description: 'Comfortable dining experience' },
      { name: 'Takeaway', description: 'Quick pickup service' }
    ],
    priceRange: '₹₹',
    features: ['WiFi Available', 'Parking Available', 'AC Available'],
    businessHours: {
      monday: { open: '09:00', close: '22:00', isClosed: false },
      tuesday: { open: '09:00', close: '22:00', isClosed: false },
      wednesday: { open: '09:00', close: '22:00', isClosed: false },
      thursday: { open: '09:00', close: '22:00', isClosed: false },
      friday: { open: '09:00', close: '22:00', isClosed: false },
      saturday: { open: '09:00', close: '23:00', isClosed: false },
      sunday: { open: '10:00', close: '22:00', isClosed: false }
    },
    ratings: {
      average: 4.5,
      totalReviews: 128,
      breakdown: {
        five: 65,
        four: 40,
        three: 15,
        two: 5,
        one: 3
      }
    },
    status: 'active',
    isPremium: true,
    premiumFeatures: {
      featuredListing: true,
      prioritySupport: true,
      analyticsAccess: true,
      customBranding: false
    },
    verification: {
      isVerified: true,
      verifiedBy: 'admin',
      verificationDate: new Date(),
      trustScore: 85
    },
    analytics: {
      totalViews: 1250,
      totalCalls: 85,
      totalDirections: 45,
      totalWebsiteClicks: 32,
      views: 1250,
      calls: 85,
      websiteClicks: 32,
      directionsRequested: 45
    },
    keywords: ['north indian', 'restaurant', 'delhi', 'authentic'],
    // tags: ['restaurant', 'food', 'north-indian', 'delhi'],
    establishedYear: 2015
  },
  {
    businessName: 'Tech Solutions Hub',
    businessType: 'IT Services',
    category: 'Professional Services',
    subCategory: 'IT Services',
    description: 'Complete IT solutions for businesses including web development, mobile apps, and digital marketing services.',
    contactInfo: {
      primaryPhone: '+91-9876543220',
      secondaryPhone: '+91-9876543221',
      email: 'info@techsolutionshub.com',
      website: 'https://techsolutionshub.com'
    },
    address: {
      street: '456 Cyber City',
      area: 'Sector 18',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122015',
      landmark: 'Near DLF Mall'
    },
    area: 'Cyber City',
    coordinates: {
      latitude: 28.4595,
      longitude: 77.0266
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400', isPrimary: false }
    ],
    services: [
      { name: 'Web Development', description: 'Custom website development' },
      { name: 'Mobile Apps', description: 'iOS and Android app development' }
    ],
    priceRange: '₹₹₹',
    features: ['WiFi Available', 'Parking Available', 'Expert Staff'],
    businessHours: {
      monday: { open: '09:00', close: '18:00', isClosed: false },
      tuesday: { open: '09:00', close: '18:00', isClosed: false },
      wednesday: { open: '09:00', close: '18:00', isClosed: false },
      thursday: { open: '09:00', close: '18:00', isClosed: false },
      friday: { open: '09:00', close: '18:00', isClosed: false },
      saturday: { open: '10:00', close: '16:00', isClosed: false },
      sunday: { open: '00:00', close: '00:00', isClosed: true }
    },
    ratings: {
      average: 4.8,
      totalReviews: 95,
      breakdown: {
        five: 75,
        four: 15,
        three: 3,
        two: 1,
        one: 1
      }
    },
    status: 'active',
    isPremium: true,
    premiumFeatures: {
      featuredListing: true,
      prioritySupport: true,
      analyticsAccess: true,
      customBranding: true
    },
    verification: {
      isVerified: true,
      verifiedBy: 'admin',
      verificationDate: new Date(),
      trustScore: 95
    },
    analytics: {
      totalViews: 890,
      totalCalls: 45,
      totalDirections: 25,
      totalWebsiteClicks: 78,
      views: 890,
      calls: 45,
      websiteClicks: 78,
      directionsRequested: 25
    },
    keywords: ['it services', 'web development', 'gurgaon', 'technology'],
    // tags: ['technology', 'it-services', 'web-development', 'gurgaon'],
    establishedYear: 2018
  },
  {
    businessName: 'Green Valley Spa',
    businessType: 'Salon',
    category: 'Beauty & Spa',
    subCategory: 'Wellness Center',
    description: 'Luxury spa and wellness center offering rejuvenating treatments and therapies in a serene environment.',
    contactInfo: {
      primaryPhone: '+91-9876543230',
      secondaryPhone: '+91-9876543231',
      email: 'bookings@greenvalleyspa.com',
      website: 'https://greenvalleyspa.com'
    },
    address: {
      street: '789 Wellness Street',
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      landmark: 'Near Forum Mall'
    },
    area: 'Koramangala',
    coordinates: {
      latitude: 12.9352,
      longitude: 77.6245
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', isPrimary: false }
    ],
    services: [
      { name: 'Massage Therapy', description: 'Relaxing full body massage' },
      { name: 'Facial Treatments', description: 'Rejuvenating facial treatments' }
    ],
    priceRange: '₹₹₹',
    features: ['AC Available', 'WiFi Available', 'Expert Staff'],
    businessHours: {
      monday: { open: '10:00', close: '20:00', isClosed: false },
      tuesday: { open: '10:00', close: '20:00', isClosed: false },
      wednesday: { open: '10:00', close: '20:00', isClosed: false },
      thursday: { open: '10:00', close: '20:00', isClosed: false },
      friday: { open: '10:00', close: '20:00', isClosed: false },
      saturday: { open: '09:00', close: '21:00', isClosed: false },
      sunday: { open: '09:00', close: '21:00', isClosed: false }
    },
    ratings: {
      average: 4.7,
      totalReviews: 156,
      breakdown: {
        five: 98,
        four: 35,
        three: 15,
        two: 5,
        one: 3
      }
    },
    status: 'active',
    isPremium: true,
    premiumFeatures: {
      featuredListing: true,
      prioritySupport: true,
      analyticsAccess: true,
      customBranding: false
    },
    verification: {
      isVerified: true,
      verifiedBy: 'admin',
      verificationDate: new Date(),
      trustScore: 88
    },
    analytics: {
      totalViews: 2100,
      totalCalls: 125,
      totalDirections: 85,
      totalWebsiteClicks: 45,
      views: 2100,
      calls: 125,
      websiteClicks: 45,
      directionsRequested: 85
    },
    keywords: ['spa', 'wellness', 'bangalore', 'massage', 'beauty'],
    // tags: ['spa', 'wellness', 'beauty', 'bangalore', 'massage'],
    establishedYear: 2020
  }
];

async function seedBusinesses() {
  try {
    // First create a default vendor if none exists
    let vendor = await Vendor.findOne();
    if (!vendor) {
      vendor = await Vendor.create({
        name: 'Default Vendor',
        email: 'vendor@example.com',
        password: 'password123',
        company: 'Sample Company',
        phone: '+91-9999999999',
        ownerDetails: {
          firstName: 'John',
          lastName: 'Doe'
        },
        address: {
          street: '123 Main Street',
          area: 'Central Area',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        verification: {
          isEmailVerified: true,
          isPhoneVerified: true,
          isDocumentVerified: true,
          verificationLevel: 'premium'
        },
        status: 'active'
      });
      console.log('Created default vendor:', vendor._id);
    }

    // Add vendor ID to all businesses
    const businessesWithVendor = sampleBusinesses.map(business => ({
      ...business,
      vendor: vendor._id
    }));

    // Clear existing businesses
    await Business.deleteMany({});
    console.log('Cleared existing businesses');

    // Insert sample businesses
    const createdBusinesses = await Business.insertMany(businessesWithVendor);
    console.log(`Created ${createdBusinesses.length} sample businesses`);

    console.log('Sample businesses created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding businesses:', error);
    process.exit(1);
  }
}

seedBusinesses();