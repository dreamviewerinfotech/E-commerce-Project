

const express = require('express');
const ProductRouter = express.Router();
const ProductController = require('../Controllers/Product.controller');

ProductRouter.post('/addProduct', ProductController.addProduct);


module.exports = ProductRouter;
