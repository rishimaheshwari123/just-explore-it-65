const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        latitude: {
            type: String,
            trim: true,
        },

        longitude: {
            type: String,
            trim: true,
        },

        category: {
            type: String, // e.g. "Electronics", "Furniture", "Jobs", "Vehicles", "Property"
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        tags: {
            type: String,
            trim: true,
        },

        keywords: {
            type: String,
            trim: true,
        },

        views: {
            type: Number,
            default: 0,
        },

        images: [
            {
                public_id: String,
                url: String,
            },
        ],

        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
