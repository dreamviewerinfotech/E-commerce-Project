

const express = require('express');
const ProductRouter = express.Router();
const ProductController = require('../Controllers/Product.controller');

ProductRouter.post('/addProduct', ProductController.addProduct);
ProductRouter.get('/allProducts' , ProductController.allProducts);
ProductRouter.put("/updateProduct/:id" , ProductController.updateProduct);
ProductRouter.delete("/deleteProduct/id" , ProductController.deleteProduct);

module.exports = ProductRouter;
