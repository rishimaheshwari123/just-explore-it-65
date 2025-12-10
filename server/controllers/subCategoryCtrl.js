const SubCategory = require('../models/subCategoryModel');
const Category = require('../models/categoryModel');

// Get all subcategories or by category
const getSubCategoriesCtrl = async (req, res) => {
    try {
        const { categoryId, active = true } = req.query;
        
        const filter = active === 'false' ? {} : { isActive: true };
        
        if (categoryId) {
            filter.category = categoryId;
        }
        
        const subCategories = await SubCategory.find(filter)
            .populate('category', 'name')
            .sort({ sortOrder: 1, name: 1 })
            .select('name description icon isActive sortOrder category');

        res.status(200).json({
            success: true,
            message: 'SubCategories fetched successfully',
            data: subCategories
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategories',
            error: error.message
        });
    }
};

// Create new subcategory
const createSubCategoryCtrl = async (req, res) => {
    try {
        const { name, description, categoryId, sortOrder } = req.body;

        if (!name || !categoryId) {
            return res.status(400).json({
                success: false,
                message: 'SubCategory name and category are required'
            });
        }

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if subcategory already exists in this category
        const existingSubCategory = await SubCategory.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            category: categoryId
        });

        if (existingSubCategory) {
            return res.status(400).json({
                success: false,
                message: 'SubCategory with this name already exists in this category'
            });
        }

        let imageUrl = null;

        // Handle image upload if present
        if (req.files && req.files.image) {
            const cloudinary = require('cloudinary').v2;
            
            try {
                const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                    folder: 'subcategories',
                    resource_type: 'image'
                });
                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: 'Failed to upload image'
                });
            }
        }

        const subCategory = new SubCategory({
            name: name.trim(),
            description: description?.trim(),
            category: categoryId,
            image: imageUrl,
            sortOrder: sortOrder || 0,
            createdBy: req.user?.id
        });

        await subCategory.save();
        
        // Populate category info before sending response
        await subCategory.populate('category', 'name');

        res.status(201).json({
            success: true,
            message: 'SubCategory created successfully',
            data: subCategory
        });
    } catch (error) {
        console.error('Error creating subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create subcategory',
            error: error.message
        });
    }
};

// Update subcategory
const updateSubCategoryCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, categoryId, isActive, sortOrder } = req.body;

        const subCategory = await SubCategory.findById(id);
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found'
            });
        }

        // If category is being changed, check if it exists
        if (categoryId && categoryId !== subCategory.category.toString()) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }

        // Check if name is being changed and if it already exists in the category
        if (name && (name !== subCategory.name || categoryId)) {
            const checkCategoryId = categoryId || subCategory.category;
            const existingSubCategory = await SubCategory.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                category: checkCategoryId,
                _id: { $ne: id }
            });

            if (existingSubCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'SubCategory with this name already exists in this category'
                });
            }
        }

        let imageUrl = subCategory.image;

        // Handle image upload if present
        if (req.files && req.files.image) {
            const cloudinary = require('cloudinary').v2;
            
            try {
                // Delete old image if exists
                if (subCategory.image) {
                    const publicId = subCategory.image.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`subcategories/${publicId}`);
                }

                const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                    folder: 'subcategories',
                    resource_type: 'image'
                });
                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: 'Failed to upload image'
                });
            }
        }

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            id,
            {
                ...(name && { name: name.trim() }),
                ...(description !== undefined && { description: description?.trim() }),
                ...(categoryId && { category: categoryId }),
                ...(imageUrl && { image: imageUrl }),
                ...(isActive !== undefined && { isActive }),
                ...(sortOrder !== undefined && { sortOrder })
            },
            { new: true, runValidators: true }
        ).populate('category', 'name');

        res.status(200).json({
            success: true,
            message: 'SubCategory updated successfully',
            data: updatedSubCategory
        });
    } catch (error) {
        console.error('Error updating subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update subcategory',
            error: error.message
        });
    }
};

// Delete subcategory
const deleteSubCategoryCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        const subCategory = await SubCategory.findById(id);
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found'
            });
        }

        // Check if subcategory is being used by any business
        const Business = require('../models/businessModel');
        const businessCount = await Business.countDocuments({ subCategory: subCategory.name });

        if (businessCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete subcategory. It is being used by ${businessCount} business(es)`
            });
        }

        await SubCategory.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'SubCategory deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete subcategory',
            error: error.message
        });
    }
};

// Get subcategory by ID
const getSubCategoryByIdCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        const subCategory = await SubCategory.findById(id).populate('category', 'name');
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'SubCategory fetched successfully',
            data: subCategory
        });
    } catch (error) {
        console.error('Error fetching subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategory',
            error: error.message
        });
    }
};

// Get subcategories by category ID
const getSubCategoriesByCategoryCtrl = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { active = true } = req.query;

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const filter = { category: categoryId };
        if (active !== 'false') {
            filter.isActive = true;
        }

        const subCategories = await SubCategory.find(filter)
            .sort({ sortOrder: 1, name: 1 })
            .select('name description icon isActive sortOrder');

        res.status(200).json({
            success: true,
            message: 'SubCategories fetched successfully',
            data: subCategories
        });
    } catch (error) {
        console.error('Error fetching subcategories by category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategories',
            error: error.message
        });
    }
};

module.exports = {
    getSubCategoriesCtrl,
    createSubCategoryCtrl,
    updateSubCategoryCtrl,
    deleteSubCategoryCtrl,
    getSubCategoryByIdCtrl,
    getSubCategoriesByCategoryCtrl
};