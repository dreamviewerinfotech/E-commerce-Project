

const ProductModel = require('../Models/Product.model');

const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dqxvndtoy', 
    api_key: '168574967552612', 
    api_secret: '3oc-CwNqOO-C6Ocs-c25-JgoxR0' 
  });


exports.addProduct = async (req, res) => {
    try {
        const { productName, description, amount } = req.body;

        const { image } = req.files || {};

        let updatedImage = '';
        if (image) {
          const result = await cloudinary.uploader.upload(image.tempFilePath);
          updatedImage = result.secure_url;
        }
        
        const newProduct = new ProductModel({
            productName,
            description,
            amount,
            image : updatedImage
        });

        const savedProduct = await newProduct.save();

        // Respond with the saved product
        res.status(201).json(savedProduct);
    } catch (error) {
        // Handle potential errors
        if (error.code === 11000) {
            // Duplicate key error
            res.status(400).json({ message: 'Amount must be unique' });
        } else {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};
exports.allProducts = async (req, res) => {
    try {
        const Products = await ProductModel.find();

        if (Products.length === 0) {
            return res.status(404).json({ message: "No Products not found" });
        }

        const allProduct = Products.map((product) => {
            return {
                productName : product.productName,
                description : product.description,
                _id: product._id,
               productAmount : product.amount,
               image : product.image
            };
        });

        res.json({ message: "Products found", result: allProduct }).status(200);
    } catch (error) {
        console.error('Error occurred in Products get', error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, description, amount } = req.body;

        let updatedProduct = { productName, description, amount };

        if (req.files && req.files.image) {
            const { image } = req.files;
            const result = await cloudinary.uploader.upload(image.tempFilePath);
            updatedProduct.image = result.secure_url;
        }

        const product = await ProductModel.findByIdAndUpdate(id, updatedProduct, { new: true });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: "Product not found" });
        }
        console.error('Error occurred while updating the product:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: "Product not found" });
        }
        console.error('Error occurred while deleting the product:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

