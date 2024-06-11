



const express = require('express');
const UserRouter = express.Router();
const UserController = require('../Controllers/User.controller');
const { ExistingUser } = require('../Middlewares/User.middleware');


UserRouter.post('/signUp', UserController.registerCivilian);
UserRouter.post('/signIn', UserController.loginCivilian);
UserRouter.get("/myProfile" , ExistingUser , UserController.userProfile)
UserRouter.get("/allUsers" , UserController.allUsers);

module.exports = UserRouter;

