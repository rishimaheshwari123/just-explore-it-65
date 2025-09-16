const mongoose = require('mongoose');
require('dotenv').config();

// Business Schema
const businessSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
    // ... other fields
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);

async function updateBusinessStatus() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to database');

        // Update Inext ETS business status from pending to active
        const result = await Business.updateOne(
            { businessName: 'Inext ETS', status: 'pending' },
            { $set: { status: 'active' } }
        );

        if (result.modifiedCount > 0) {
            console.log('Successfully updated Inext ETS business status to active');
        } else {
            console.log('No business found with name "Inext ETS" and status "pending"');
        }

        // Verify the update
        const updatedBusiness = await Business.findOne({ businessName: 'Inext ETS' });
        if (updatedBusiness) {
            console.log(`Verified: ${updatedBusiness.businessName} status is now: ${updatedBusiness.status}`);
        }

        // Show updated count
        const activeCount = await Business.countDocuments({ status: 'active' });
        const pendingCount = await Business.countDocuments({ status: 'pending' });
        console.log(`\nUpdated counts:`);
        console.log(`Active businesses: ${activeCount}`);
        console.log(`Pending businesses: ${pendingCount}`);

    } catch (error) {
        console.error('Error updating business status:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

updateBusinessStatus();