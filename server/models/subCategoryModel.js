const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: String, // Cloudinary URL
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Compound index to ensure unique subcategory name within a category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });
subCategorySchema.index({ category: 1, isActive: 1, sortOrder: 1 });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;