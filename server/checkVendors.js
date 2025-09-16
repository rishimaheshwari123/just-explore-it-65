const mongoose = require('mongoose');
const Vendor = require('./models/vendorModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://infoinextets:VWi8V6YTnxIgESpW@cluster0.3doac7y.mongodb.net/business-guruji', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const checkVendors = async () => {
    try {
        console.log('Checking all vendors in database...');
        
        const vendors = await Vendor.find({}).select('_id name email phone');
        
        if (vendors.length === 0) {
            console.log('No vendors found in database.');
        } else {
            console.log(`Found ${vendors.length} vendors:`);
            vendors.forEach((vendor, index) => {
                console.log(`${index + 1}. ID: ${vendor._id}`);
                console.log(`   Name: ${vendor.name || 'N/A'}`);
                console.log(`   Email: ${vendor.email || 'N/A'}`);
                console.log(`   Phone: ${vendor.phone || 'N/A'}`);
                console.log('---');
            });
        }
        
        // Also check if the specific vendor ID exists
        const specificVendor = await Vendor.findById('68c10c881b9aff6e9b853fd5');
        if (specificVendor) {
            console.log('\n✅ Found specific vendor:', specificVendor);
        } else {
            console.log('\n❌ Vendor ID 68c10c881b9aff6e9b853fd5 not found');
        }
        
    } catch (error) {
        console.error('Error checking vendors:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the function
checkVendors();