require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('./models/businessModel');

const checkBusinesses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to database');
        
        const allBusinesses = await Business.find({});
        console.log(`Total businesses in database: ${allBusinesses.length}`);
        
        console.log('\nAll businesses with status:');
        allBusinesses.forEach((business, index) => {
            console.log(`${index + 1}. ${business.businessName} - ${business.category} - Status: ${business.status}`);
        });
        
        const activeBusinesses = await Business.find({ status: 'active' });
        console.log(`\nActive businesses: ${activeBusinesses.length}`);
        
        const pendingBusinesses = await Business.find({ status: 'pending' });
        console.log(`Pending businesses: ${pendingBusinesses.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkBusinesses();