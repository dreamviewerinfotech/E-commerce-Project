

const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/Category.controller');
const fileUpload = require('express-fileupload'); 


router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Create Category
router.post('/categories', categoryController.createCategory);

// Get All Categories
router.get('/categories', categoryController.getAllCategories);

// Update Category
router.put('/categories/:id', categoryController.updateCategory);

// Delete Category
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
