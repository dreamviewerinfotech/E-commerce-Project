





const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    
    productName: {
        type: String,
        required: true
    },
    description : {
        type: String,
    },
    amount: {
        type: String,
        unique: true,
        required: true,
    }
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports =  ProductModel;



