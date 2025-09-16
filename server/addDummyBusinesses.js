const mongoose = require('mongoose');
const Business = require('./models/businessModel');
const Vendor = require('./models/vendorModel');

// MongoDB connection string
const MONGODB_URL = 'mongodb+srv://infoinextets:VWi8V6YTnxIgESpW@cluster0.3doac7y.mongodb.net/business-guruji';

// Sample dummy businesses data
const dummyBusinesses = [
  {
    businessName: "Sharma Restaurant",
    businessType: "Restaurant",
    category: "Food & Dining",
    subcategory: "North Indian",
    description: "Authentic North Indian cuisine with traditional flavors and modern presentation.",
    contactInfo: {
      primaryPhone: "+91-9876543210",
      secondaryPhone: "+91-9876543211",
      email: "contact@sharmarestaurant.com",
      website: "www.sharmarestaurant.com"
    },
    address: {
      street: "123 Main Street",
      area: "Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      landmark: "Near Metro Station"
    },
    coordinates: {
            latitude: 28.6139,
            longitude: 77.2090
        },
        area: "Connaught Place",
    businessHours: {
      monday: { open: "09:00", close: "22:00", isOpen: true },
      tuesday: { open: "09:00", close: "22:00", isOpen: true },
      wednesday: { open: "09:00", close: "22:00", isOpen: true },
      thursday: { open: "09:00", close: "22:00", isOpen: true },
      friday: { open: "09:00", close: "23:00", isOpen: true },
      saturday: { open: "09:00", close: "23:00", isOpen: true },
      sunday: { open: "10:00", close: "22:00", isOpen: true }
    },
    services: [
      {
        name: "Dine-in",
        description: "Comfortable dining experience",
        price: {
          min: 300,
          max: 800,
          currency: "INR",
          priceType: "range"
        }
      },
      {
        name: "Home Delivery",
        description: "Fast home delivery service",
        price: {
          min: 50,
          max: 50,
          currency: "INR",
          priceType: "fixed"
        }
      }
    ],
    features: ["Quality Assured", "Online Booking", "Home Delivery"],
    priceRange: "₹₹",
    images: [{
      url: "https://example.com/restaurant1.jpg",
      caption: "Restaurant Interior",
      isPrimary: true
    }],
    keywords: ["restaurant", "food", "dining", "north indian"],
    tags: ["popular", "family friendly"]
  },
  {
    businessName: "TechFix Solutions",
    businessType: "IT Services",
    category: "Electronics & Technology",
    subcategory: "Computer Repair",
    description: "Professional computer and laptop repair services with quick turnaround time.",
    contactInfo: {
      primaryPhone: "+91-9876543220",
      email: "info@techfixsolutions.com",
      website: "www.techfixsolutions.com"
    },
    address: {
      street: "456 Tech Park",
      area: "Cyber City",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122002",
      landmark: "Near DLF Mall"
    },
    coordinates: {
            latitude: 28.4595,
            longitude: 77.0266
        },
        area: "Cyber City",
    businessHours: {
      monday: { open: "10:00", close: "19:00", isOpen: true },
      tuesday: { open: "10:00", close: "19:00", isOpen: true },
      wednesday: { open: "10:00", close: "19:00", isOpen: true },
      thursday: { open: "10:00", close: "19:00", isOpen: true },
      friday: { open: "10:00", close: "19:00", isOpen: true },
      saturday: { open: "10:00", close: "17:00", isOpen: true },
      sunday: { open: "11:00", close: "16:00", isOpen: true }
    },
    services: [
      {
        name: "Laptop Repair",
        description: "Complete laptop repair and maintenance",
        price: {
          min: 1000,
          max: 2000,
          currency: "INR",
          priceType: "range"
        }
      },
      {
        name: "Data Recovery",
        description: "Professional data recovery services",
        price: {
          min: 2500,
          max: 2500,
          currency: "INR",
          priceType: "starting_from"
        }
      }
    ],
    features: ["Quality Assured", "Free Consultation", "Warranty Available"],
    priceRange: "₹₹₹",
    images: [{
      url: "https://example.com/techfix1.jpg",
      caption: "Service Center",
      isPrimary: true
    }],
    keywords: ["computer repair", "laptop", "technology", "IT services"],
    tags: ["reliable", "quick service"]
  },
  {
    businessName: "Wellness Spa & Salon",
    businessType: "Salon",
    category: "Beauty & Spa",
    subcategory: "Full Service Salon",
    description: "Premium spa and salon services for complete wellness and beauty care.",
    contactInfo: {
      primaryPhone: "+91-9876543230",
      email: "booking@wellnessspa.com",
      website: "www.wellnessspa.com"
    },
    address: {
      street: "789 Beauty Street",
      area: "Khan Market",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110003",
      landmark: "Near Khan Market Metro"
    },
    coordinates: {
            latitude: 28.5984,
            longitude: 77.2319
        },
        area: "Khan Market",
    businessHours: {
      monday: { open: "09:00", close: "20:00", isOpen: true },
      tuesday: { open: "09:00", close: "20:00", isOpen: true },
      wednesday: { open: "09:00", close: "20:00", isOpen: true },
      thursday: { open: "09:00", close: "20:00", isOpen: true },
      friday: { open: "09:00", close: "21:00", isOpen: true },
      saturday: { open: "09:00", close: "21:00", isOpen: true },
      sunday: { open: "10:00", close: "19:00", isOpen: true }
    },
    services: [
      {
        name: "Hair Styling",
        description: "Professional hair cut and styling",
        price: {
          min: 500,
          max: 1200,
          currency: "INR",
          priceType: "range"
        }
      },
      {
        name: "Facial Treatment",
        description: "Rejuvenating facial treatments",
        price: {
          min: 800,
          max: 1500,
          currency: "INR",
          priceType: "range"
        }
      },
      {
        name: "Body Massage",
        description: "Relaxing full body massage",
        price: {
          min: 1500,
          max: 2500,
          currency: "INR",
          priceType: "range"
        }
      }
    ],
    features: ["Quality Assured", "Online Booking", "Expert Staff"],
    priceRange: "₹₹₹",
    images: [{
      url: "https://example.com/spa1.jpg",
      caption: "Spa Interior",
      isPrimary: true
    }],
    keywords: ["spa", "salon", "beauty", "wellness", "massage"],
    tags: ["luxury", "relaxing"]
  },
  {
    businessName: "City Medical Center",
    businessType: "Hospital",
    category: "Healthcare",
    subcategory: "General Practice",
    description: "Comprehensive healthcare services with experienced doctors and modern facilities.",
    contactInfo: {
      primaryPhone: "+91-9876543240",
      secondaryPhone: "+91-9876543241",
      email: "appointments@citymedical.com",
      website: "www.citymedical.com"
    },
    address: {
      street: "321 Health Avenue",
      area: "Lajpat Nagar",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110024",
      landmark: "Near Central Market"
    },
    coordinates: {
            latitude: 28.5677,
            longitude: 77.2431
        },
        area: "Lajpat Nagar",
    businessHours: {
      monday: { open: "08:00", close: "20:00", isOpen: true },
      tuesday: { open: "08:00", close: "20:00", isOpen: true },
      wednesday: { open: "08:00", close: "20:00", isOpen: true },
      thursday: { open: "08:00", close: "20:00", isOpen: true },
      friday: { open: "08:00", close: "20:00", isOpen: true },
      saturday: { open: "08:00", close: "18:00", isOpen: true },
      sunday: { open: "09:00", close: "17:00", isOpen: true }
    },
    services: [
      {
        name: "General Consultation",
        description: "General health checkup and consultation",
        price: {
          min: 400,
          max: 600,
          currency: "INR",
          priceType: "range"
        }
      },
      {
        name: "Blood Test",
        description: "Complete blood analysis",
        price: {
          min: 500,
          max: 1200,
          currency: "INR",
          priceType: "range"
        }
      },
      {
        name: "X-Ray",
        description: "Digital X-ray services",
        price: {
          min: 400,
          max: 800,
          currency: "INR",
          priceType: "range"
        }
      }
    ],
    features: ["Quality Assured", "Online Booking", "Emergency Service"],
    priceRange: "₹₹",
    images: [{
      url: "https://example.com/medical1.jpg",
      caption: "Medical Center",
      isPrimary: true
    }],
    keywords: ["hospital", "doctor", "healthcare", "medical", "clinic"],
    tags: ["trusted", "experienced"]
  },
  {
    businessName: "AutoCare Service Center",
    businessType: "Auto Repair",
    category: "Automotive",
    subcategory: "Car Repair",
    description: "Complete automotive repair and maintenance services for all car brands.",
    contactInfo: {
      primaryPhone: "+91-9876543250",
      email: "service@autocare.com",
      website: "www.autocare.com"
    },
    address: {
      street: "654 Service Road",
      area: "Mayur Vihar",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110091",
      landmark: "Near Akshardham Metro"
    },
    coordinates: {
            latitude: 28.6508,
            longitude: 77.3152
        },
        area: "Mayur Vihar",
    businessHours: {
      monday: { open: "09:00", close: "18:00", isOpen: true },
      tuesday: { open: "09:00", close: "18:00", isOpen: true },
      wednesday: { open: "09:00", close: "18:00", isOpen: true },
      thursday: { open: "09:00", close: "18:00", isOpen: true },
      friday: { open: "09:00", close: "18:00", isOpen: true },
      saturday: { open: "09:00", close: "17:00", isOpen: true },
      sunday: { open: "00:00", close: "00:00", isOpen: false }
    },
    services: [
      {
        name: "Car Servicing",
        description: "Complete car maintenance and servicing",
        price: {
          min: 2500,
          max: 4000,
          currency: "INR",
          priceType: "range"
        }
      },
      {
        name: "Oil Change",
        description: "Engine oil and filter replacement",
        price: {
          min: 1200,
          max: 2000,
          currency: "INR",
          priceType: "range"
        }
      },
      {
        name: "Brake Repair",
        description: "Brake system inspection and repair",
        price: {
          min: 2000,
          max: 3500,
          currency: "INR",
          priceType: "range"
        }
      }
     ],
     features: ["Quality Assured", "Warranty Available", "Home Delivery"],
    priceRange: "₹₹₹",
    images: [{
      url: "https://example.com/autocare1.jpg",
      caption: "Service Center",
      isPrimary: true
    }],
    keywords: ["car repair", "automotive", "service", "maintenance"],
    tags: ["professional", "warranty"]
  }
];

async function addDummyBusinesses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully!');

    // Check if businesses already exist
    const existingBusinesses = await Business.find({});
    console.log(`Found ${existingBusinesses.length} existing businesses in database`);

    // Create a sample vendor if none exists
    let vendor = await Vendor.findOne({});
    if (!vendor) {
      const vendorData = {
        name: "Sample Vendor",
        email: "vendor@example.com",
        password: "hashedpassword123",
        phone: "+91-9999999999",
        ownerDetails: {
          firstName: "John",
          lastName: "Doe"
        },
        company: "Sample Company Pvt Ltd",
        address: {
          street: "123 Business Street",
          area: "Business District",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110001"
        }
      };
      
      vendor = new Vendor(vendorData);
      await vendor.save();
      console.log('Created sample vendor:', vendor._id);
    } else {
      console.log('Using existing vendor:', vendor._id);
    }

    // Add vendor ID to each business
    const businessesWithVendor = dummyBusinesses.map(business => ({
      ...business,
      vendor: vendor._id
    }));

    // Insert dummy businesses
    const result = await Business.insertMany(businessesWithVendor);
    console.log(`Successfully added ${result.length} dummy businesses to the database!`);
    
    // Display created businesses
    result.forEach((business, index) => {
      console.log(`${index + 1}. ${business.businessName} (ID: ${business._id})`);
    });

  } catch (error) {
    console.error('Error adding dummy businesses:', error.message);
    if (error.code === 11000) {
      console.log('Some businesses may already exist in the database.');
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the function
addDummyBusinesses();