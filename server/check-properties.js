const mongoose = require('mongoose');
const Business = require('./models/businessModel');

async function checkProperties() {
  try {
    await mongoose.connect('mongodb+srv://infoinextets:VWi8V6YTnxIgESpW@cluster0.3doac7y.mongodb.net/business-guruji');
    console.log('Connected to DB');
    
    // Check Real Estate properties
    const properties = await Business.find({category: 'Real Estate'});
    console.log('Real Estate properties:', properties.length);
    
    // Check all businesses
    const allBusinesses = await Business.find({});
    console.log('All businesses:', allBusinesses.length);
    
    // List all businesses with details
    console.log('\n=== Business Details ===');
    allBusinesses.forEach((business, index) => {
        console.log(`${index + 1}. Name: ${business.businessName}`);
        console.log(`   Category: '${business.category}'`);
        console.log(`   Status: ${business.status}`);
        console.log(`   Created: ${business.createdAt}`);
        console.log('---');
    });
    
    // Check specifically for properties with different filters
    const activeProperties = await Business.find({
      category: 'Real Estate',
      status: 'active'
    });
    console.log('\nActive Real Estate properties:', activeProperties.length);
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkProperties();