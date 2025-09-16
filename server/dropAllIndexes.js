const mongoose = require('mongoose');
const Business = require('./models/businessModel');

// MongoDB connection string
const mongoURI = 'mongodb+srv://infoinextets:VWi8V6YTnxIgESpW@cluster0.3doac7y.mongodb.net/business-guruji';

async function dropAllIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully!');

    // Get all indexes
    const indexes = await Business.collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Drop all indexes except _id_
    for (const index of indexes) {
      if (index.name !== '_id_') {
        try {
          await Business.collection.dropIndex(index.name);
          console.log(`Dropped index: ${index.name}`);
        } catch (error) {
          console.log(`Could not drop index ${index.name}:`, error.message);
        }
      }
    }

    console.log('All indexes dropped successfully!');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');

  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the function
dropAllIndexes();