





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
        type: Number,
        required: true,
    },
    category : {
        type: String,
    },
    image : {
        type: String
    }
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports =  ProductModel;



