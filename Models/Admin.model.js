



const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    
    Name: {
        type: String,
        required: true
    },
    image : {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    userName : {
        type: String,
        required: true,
        default: "Admin2023"
    },
    designation : {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    mobileNo : {
        type:Number,
        required: true
    },
    confirmPassword : {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
        default:' '
    },
});

const AdminModel = mongoose.model('Admin', AdminSchema);

module.exports =  AdminModel;



