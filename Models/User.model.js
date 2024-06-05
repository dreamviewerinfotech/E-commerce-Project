



const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
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
    password: {
        type: String,
        required: true
    },
    confirmPassword : {
        type: String,
        required: true
    },
    mobileno : {
        type:Number,
        required: true
    },
    address : {
        type: String,
    },
    otp: {
        type: String,
        required: true,
        default:' '
    },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports =  UserModel;



