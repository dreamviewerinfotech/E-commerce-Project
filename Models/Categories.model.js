




const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    
    categoryName: {
        type: String,
        required: true
    },
    description : {
        type: String,
    },
    image : {
        type: String
    }
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports =  CategoryModel;



