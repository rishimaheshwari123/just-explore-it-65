const mongoose = require('mongoose');
const Business = require('./models/businessModel');
const Vendor = require('./models/vendorModel');

// MongoDB connection string
const mongoURI = 'mongodb+srv://infoinextets:VWi8V6YTnxIgESpW@cluster0.3doac7y.mongodb.net/business-guruji';

async function dropIndexesAndAddBusinesses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully!');

    // Drop existing indexes that might cause parallel array issues
    try {
      await Business.collection.dropIndex('tags_1');
      console.log('Dropped tags index');
    } catch (error) {
      console.log('Tags index not found or already dropped');
    }

    try {
      await Business.collection.dropIndex('keywords_1');
      console.log('Dropped keywords index');
    } catch (error) {
      console.log('Keywords index not found or already dropped');
    }

    // Check if businesses already exist
    const existingBusinesses = await Business.countDocuments();
    console.log(`Found ${existingBusinesses} existing businesses in database`);

    // Check if vendor exists, if not create one
    let vendor = await Vendor.findOne();
    if (!vendor) {
      vendor = new Vendor({
        name: 'Sample Vendor',
        email: 'vendor@example.com',
        phone: '9876543210',
        address: {
          street: '123 Main St',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India'
        }
      });
      await vendor.save();
      console.log('Created new vendor:', vendor._id);
    } else {
      console.log('Using existing vendor:', vendor._id);
    }

    // Dummy business data
    const businessesData = [
      {
        businessName: 'Spice Garden Restaurant',
        businessType: 'Restaurant',
        category: 'Food & Dining',
        description: 'Authentic North Indian cuisine with traditional flavors',
        contactInfo: {
          primaryPhone: '9876543210',
          secondaryPhone: '9876543211',
          email: 'info@spicegarden.com',
          website: 'https://spicegarden.com'
        },
        address: {
          street: '123 Main Street',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India',
          area: 'Connaught Place'
        },
        area: 'Connaught Place',
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090
        },
        businessHours: {
          monday: { open: '10:00', close: '22:00', isOpen: true },
          tuesday: { open: '10:00', close: '22:00', isOpen: true },
          wednesday: { open: '10:00', close: '22:00', isOpen: true },
          thursday: { open: '10:00', close: '22:00', isOpen: true },
          friday: { open: '10:00', close: '22:00', isOpen: true },
          saturday: { open: '10:00', close: '23:00', isOpen: true },
          sunday: { open: '10:00', close: '23:00', isOpen: true }
        },
        services: [{
          name: 'Dine-in',
          description: 'Restaurant dining experience',
          price: {
            min: 500,
            max: 2000,
            currency: 'INR',
            priceType: 'fixed'
          }
        }],
        features: ['WiFi Available', 'Parking Available', 'AC Available'],
        images: [{
          url: 'https://example.com/restaurant1.jpg',
          caption: 'Restaurant interior',
          isPrimary: true
        }],
        keywords: ['restaurant', 'food', 'dining', 'north indian'],
        vendor: vendor._id
      },
      {
        businessName: 'TechFix Solutions',
        businessType: 'IT Services',
        category: 'Electronics & Technology',
        description: 'Professional computer and laptop repair services',
        contactInfo: {
          primaryPhone: '9876543212',
          secondaryPhone: '9876543213',
          email: 'info@techfix.com',
          website: 'https://techfix.com'
        },
        address: {
          street: '456 Tech Street',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001',
          country: 'India',
          area: 'Cyber City'
        },
        area: 'Cyber City',
        coordinates: {
          latitude: 28.4595,
          longitude: 77.0266
        },
        businessHours: {
          monday: { open: '09:00', close: '18:00', isOpen: true },
          tuesday: { open: '09:00', close: '18:00', isOpen: true },
          wednesday: { open: '09:00', close: '18:00', isOpen: true },
          thursday: { open: '09:00', close: '18:00', isOpen: true },
          friday: { open: '09:00', close: '18:00', isOpen: true },
          saturday: { open: '10:00', close: '16:00', isOpen: true },
          sunday: { open: '10:00', close: '16:00', isOpen: false }
        },
        services: [{
          name: 'Laptop Repair',
          description: 'Complete laptop repair and maintenance',
          price: {
            min: 1000,
            max: 5000,
            currency: 'INR',
            priceType: 'fixed'
          }
        }],
        features: ['Home Delivery', 'Warranty Available', 'Expert Staff'],
        images: [{
          url: 'https://example.com/techfix1.jpg',
          caption: 'Tech repair shop',
          isPrimary: true
        }],
        keywords: ['computer repair', 'laptop', 'technology', 'IT services'],
        vendor: vendor._id
      },
      {
        businessName: 'Bliss Spa & Salon',
        businessType: 'Salon',
        category: 'Beauty & Spa',
        description: 'Premium spa and salon services for complete relaxation',
        contactInfo: {
          primaryPhone: '9876543214',
          secondaryPhone: '9876543215',
          email: 'info@blissspa.com',
          website: 'https://blissspa.com'
        },
        address: {
          street: '789 Beauty Lane',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          area: 'Bandra'
        },
        area: 'Bandra',
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        },
        businessHours: {
          monday: { open: '10:00', close: '20:00', isOpen: true },
          tuesday: { open: '10:00', close: '20:00', isOpen: true },
          wednesday: { open: '10:00', close: '20:00', isOpen: true },
          thursday: { open: '10:00', close: '20:00', isOpen: true },
          friday: { open: '10:00', close: '20:00', isOpen: true },
          saturday: { open: '09:00', close: '21:00', isOpen: true },
          sunday: { open: '09:00', close: '21:00', isOpen: true }
        },
        services: [{
          name: 'Full Body Massage',
          description: 'Relaxing full body massage therapy',
          price: {
            min: 2000,
            max: 5000,
            currency: 'INR',
            priceType: 'fixed'
          }
        }],
        features: ['AC Available', 'WiFi Available', 'Online Booking'],
        images: [{
          url: 'https://example.com/spa1.jpg',
          caption: 'Spa interior',
          isPrimary: true
        }],
        keywords: ['spa', 'salon', 'beauty', 'wellness', 'massage'],
        vendor: vendor._id
      },
      {
        businessName: 'City General Hospital',
        businessType: 'Hospital',
        category: 'Healthcare',
        description: 'Multi-specialty hospital with 24/7 emergency services',
        contactInfo: {
          primaryPhone: '9876543216',
          secondaryPhone: '9876543217',
          email: 'info@cityhospital.com',
          website: 'https://cityhospital.com'
        },
        address: {
          street: '321 Health Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India',
          area: 'MG Road'
        },
        area: 'MG Road',
        coordinates: {
          latitude: 12.9716,
          longitude: 77.5946
        },
        businessHours: {
          monday: { open: '00:00', close: '23:59', isOpen: true },
          tuesday: { open: '00:00', close: '23:59', isOpen: true },
          wednesday: { open: '00:00', close: '23:59', isOpen: true },
          thursday: { open: '00:00', close: '23:59', isOpen: true },
          friday: { open: '00:00', close: '23:59', isOpen: true },
          saturday: { open: '00:00', close: '23:59', isOpen: true },
          sunday: { open: '00:00', close: '23:59', isOpen: true }
        },
        services: [{
          name: 'General Consultation',
          description: 'General medical consultation',
          price: {
            min: 500,
            max: 1500,
            currency: 'INR',
            priceType: 'fixed'
          }
        }],
        features: ['Emergency Service', 'Parking Available', '24/7 Service'],
        images: [{
          url: 'https://example.com/hospital1.jpg',
          caption: 'Hospital building',
          isPrimary: true
        }],
        keywords: ['hospital', 'doctor', 'healthcare', 'medical', 'clinic'],
        vendor: vendor._id
      },
      {
        businessName: 'AutoCare Service Center',
        businessType: 'Auto Repair',
        category: 'Automotive',
        description: 'Professional car repair and maintenance services',
        contactInfo: {
          primaryPhone: '9876543218',
          secondaryPhone: '9876543219',
          email: 'info@autocare.com',
          website: 'https://autocare.com'
        },
        address: {
          street: '654 Auto Street',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
          country: 'India',
          area: 'T Nagar'
        },
        area: 'T Nagar',
        coordinates: {
          latitude: 13.0827,
          longitude: 80.2707
        },
        businessHours: {
          monday: { open: '08:00', close: '18:00', isOpen: true },
          tuesday: { open: '08:00', close: '18:00', isOpen: true },
          wednesday: { open: '08:00', close: '18:00', isOpen: true },
          thursday: { open: '08:00', close: '18:00', isOpen: true },
          friday: { open: '08:00', close: '18:00', isOpen: true },
          saturday: { open: '08:00', close: '17:00', isOpen: true },
          sunday: { open: '09:00', close: '15:00', isOpen: false }
        },
        services: [{
          name: 'Car Service',
          description: 'Complete car servicing and maintenance',
          price: {
            min: 2000,
            max: 8000,
            currency: 'INR',
            priceType: 'fixed'
          }
        }],
        features: ['Warranty Available', 'Home Delivery', 'Expert Staff'],
        images: [{
          url: 'https://example.com/autocare1.jpg',
          caption: 'Auto service center',
          isPrimary: true
        }],
        keywords: ['car repair', 'automotive', 'service', 'maintenance'],
        vendor: vendor._id
      }
    ];

    // Insert businesses without tags field to avoid parallel array indexing
    const businessesToInsert = businessesData.map(business => {
      const { tags, ...businessWithoutTags } = business;
      return businessWithoutTags;
    });

    const insertedBusinesses = await Business.insertMany(businessesToInsert);
    console.log(`Successfully added ${insertedBusinesses.length} dummy businesses to the database!`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');

  } catch (error) {
    console.error('Error adding dummy businesses:', error.message);
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the function
dropIndexesAndAddBusinesses();