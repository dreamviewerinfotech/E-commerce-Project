

const categoryModel = require("./../Models/Categories.model");


const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dqxvndtoy', 
    api_key: '168574967552612', 
    api_secret: '3oc-CwNqOO-C6Ocs-c25-JgoxR0' 
  });

exports.createCategory = async (req, res) => {
    try {
        const { categoryName, description } = req.body;
        let image = '';

        if (req.files && req.files.image) {
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
            image = result.secure_url;
        }

        const newCategory = new categoryModel({
            categoryName,
            description,
            image
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error occurred while creating the category:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();

        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).json({ message: "Categories found", result: categories });
    } catch (error) {
        console.error('Error occurred while fetching categories:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, description } = req.body;
        let updatedCategory = { categoryName, description };

        if (req.files && req.files.image) {
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
            updatedCategory.image = result.secure_url;
        }

        const category = await CategoryModel.findByIdAndUpdate(id, updatedCategory, { new: true });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: "Category not found" });
        }
        console.error('Error occurred while updating the category:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategoryModel.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: "Category not found" });
        }
        console.error('Error occurred while deleting the category:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
