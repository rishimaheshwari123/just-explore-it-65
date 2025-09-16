const mongoose = require('mongoose');
require('dotenv').config();

const dropIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
        
        // Drop all indexes except _id
        const result = await mongoose.connection.db.collection('businesses').dropIndexes();
        console.log('All indexes dropped successfully:', result);
        
        // Recreate only the necessary index
        await mongoose.connection.db.collection('businesses').createIndex({ location: '2dsphere' });
        console.log('2dsphere index recreated');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

dropIndexes();