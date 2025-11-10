const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        index: true,
        trim: true,
    },
    desc: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    tags: [{
        type: String,
        trim: true,
    }],
    keywords: [{
        type: String,
        trim: true,
    }],
    type: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});

// Ensure slug is lowercase
blogSchema.pre('save', function(next) {
    if (this.slug) {
        this.slug = this.slug.toLowerCase();
    }
    next();
});

module.exports = mongoose.model("Blog", blogSchema);
