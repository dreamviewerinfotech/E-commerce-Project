



const express = require('express');
const AdminRouter = express.Router();
const AdminController = require('../Controllers/Admin.controller');
const { ExistingAdmin } = require('../Middlewares/Admin.middleware');

AdminRouter.post('/signUp', AdminController.signUp);
AdminRouter.post('/signIn', AdminController.signIn);
AdminRouter.get("/myProfile" , ExistingAdmin, AdminController.adminProfile);


module.exports = AdminRouter;


