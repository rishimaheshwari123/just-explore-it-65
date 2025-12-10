const Category = require('../models/categoryModel');

// Get all categories
const getCategoriesCtrl = async (req, res) => {
    try {
        const { active = true, includeSubCategories = false } = req.query;
        
        const filter = active === 'false' ? {} : { isActive: true };
        
        let query = Category.find(filter)
            .sort({ sortOrder: 1, name: 1 })
            .select('name description icon isActive sortOrder');

        // Include subcategories if requested
        if (includeSubCategories === 'true') {
            query = query.populate({
                path: 'subCategories',
                match: { isActive: true },
                select: 'name description icon sortOrder',
                options: { sort: { sortOrder: 1, name: 1 } }
            });
        }

        const categories = await query;

        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};

// Create new category
const createCategoryCtrl = async (req, res) => {
    try {
        const { name, description, sortOrder } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }

        let imageUrl = null;

        // Handle image upload if present
        if (req.files && req.files.image) {
            const cloudinary = require('cloudinary').v2;
            
            try {
                const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                    folder: 'categories',
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

        const category = new Category({
            name: name.trim(),
            description: description?.trim(),
            image: imageUrl,
            sortOrder: sortOrder || 0,
            createdBy: req.user?.id
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error.message
        });
    }
};

// Update category
const updateCategoryCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive, sortOrder } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if name is being changed and if it already exists
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: id }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists'
                });
            }
        }

        let imageUrl = category.image;

        // Handle image upload if present
        if (req.files && req.files.image) {
            const cloudinary = require('cloudinary').v2;
            
            try {
                // Delete old image if exists
                if (category.image) {
                    const publicId = category.image.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`categories/${publicId}`);
                }

                const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                    folder: 'categories',
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

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                ...(name && { name: name.trim() }),
                ...(description !== undefined && { description: description?.trim() }),
                ...(imageUrl && { image: imageUrl }),
                ...(isActive !== undefined && { isActive }),
                ...(sortOrder !== undefined && { sortOrder })
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: error.message
        });
    }
};

// Delete category
const deleteCategoryCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has subcategories
        const SubCategory = require('../models/subCategoryModel');
        const subCategoryCount = await SubCategory.countDocuments({ category: id });

        if (subCategoryCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${subCategoryCount} subcategory(ies). Please delete subcategories first.`
            });
        }

        // Check if category is being used by any business
        const Business = require('../models/businessModel');
        const businessCount = await Business.countDocuments({ category: category.name });

        if (businessCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It is being used by ${businessCount} business(es)`
            });
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error.message
        });
    }
};

// Get category by ID
const getCategoryByIdCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category fetched successfully',
            data: category
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category',
            error: error.message
        });
    }
};

module.exports = {
    getCategoriesCtrl,
    createCategoryCtrl,
    updateCategoryCtrl,
    deleteCategoryCtrl,
    getCategoryByIdCtrl
};