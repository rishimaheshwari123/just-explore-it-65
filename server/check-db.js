const mongoose = require('mongoose');
const Business = require('./models/businessModel');

mongoose.connect('mongodb+srv://infoinextets:VWi8V6YTnxIgESpW@cluster0.3doac7y.mongodb.net/business-guruji')
  .then(async () => {
    console.log('Connected to database');
    
    const totalCount = await Business.countDocuments();
    console.log('Total businesses:', totalCount);
    
    const activeCount = await Business.countDocuments({status: 'active'});
    console.log('Active businesses:', activeCount);
    
    const businesses = await Business.find({}, 'businessName status category');
    console.log('All businesses:');
    businesses.forEach(b => {
      console.log(`- ${b.businessName} (${b.status}) - ${b.category}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });