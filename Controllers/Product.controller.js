

const ProductModel = require('../Models/Product.model');

exports.addProduct = async (req, res) => {
    try {
        const { productName, description, amount } = req.body;

        // Create a new product instance
        const newProduct = new ProductModel({
            productName,
            description,
            amount
        });

        // Save the product to the database
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
               productAmount : product.amount
            };
        });

        res.json({ message: "Products found", result: allProduct }).status(200);
    } catch (error) {
        console.error('Error occurred in Products get', error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
