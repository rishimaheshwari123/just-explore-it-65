const express = require('express');
const {
    getCategoriesCtrl,
    createCategoryCtrl,
    updateCategoryCtrl,
    deleteCategoryCtrl,
    getCategoryByIdCtrl
} = require('../controllers/categoryCtrl');

const {
    getSubCategoriesCtrl,
    createSubCategoryCtrl,
    updateSubCategoryCtrl,
    deleteSubCategoryCtrl,
    getSubCategoryByIdCtrl,
    getSubCategoriesByCategoryCtrl
} = require('../controllers/subCategoryCtrl');

const router = express.Router();

// Category routes
// Public routes
router.get('/categories', getCategoriesCtrl);
router.get('/categories/:id', getCategoryByIdCtrl);

// Admin routes (you can add auth middleware here)
router.post('/categories', createCategoryCtrl);
router.put('/categories/:id', updateCategoryCtrl);
router.delete('/categories/:id', deleteCategoryCtrl);

// SubCategory routes
// Public routes
router.get('/subcategories', getSubCategoriesCtrl);
router.get('/subcategories/:id', getSubCategoryByIdCtrl);
router.get('/categories/:categoryId/subcategories', getSubCategoriesByCategoryCtrl);

// Admin routes (you can add auth middleware here)
router.post('/subcategories', createSubCategoryCtrl);
router.put('/subcategories/:id', updateSubCategoryCtrl);
router.delete('/subcategories/:id', deleteSubCategoryCtrl);

module.exports = router;