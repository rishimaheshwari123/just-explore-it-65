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

        category: {
            type: String, // e.g. "Electronics", "Furniture", "Jobs", "Vehicles", "Property"
            required: true,
            trim: true,
        },

        description: {
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
            ref: "Vendor",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
