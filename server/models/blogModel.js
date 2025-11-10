const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        trim: true,
        unique: true,
        index: true
    },
    desc: {
        type: String,
        required: true
    },
    keywords: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        required: false
    },
    images: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);
