const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
    },
    bedrooms: {
        type: String,
    },
    bathrooms: {
        type: String,
    },
    area: {
        type: String,
    },
    description: {
        type: String,
        trim: true,
    },
    floors: {
        type: String,
        trim: true,
    },
    parking: {
        type: String,
        trim: true,
    },
    furnished: {
        type: String,
        trim: true,
    },
    plotType: {
        type: String,
        trim: true,
    },


    images: [
        {
            public_id: String,
            url: String,
        },
    ],
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
