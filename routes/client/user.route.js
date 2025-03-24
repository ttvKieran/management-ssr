const express = require('express');
const routes = express.Router();
const userController = require('../../controllers/client/user.controller');
const userValidate = require('../../validates/client/userValidate');

// GET - /user/login
routes.get('/login', userController.login);

// POST - /user/login
routes.post('/login', userValidate.login, userController.loginCheck);

// GET - /user/register
routes.get('/register', userController.register);

// POST - /user/register
routes.post('/register', userValidate.register, userController.registerPost);

// GET - /user/logout
routes.get('/logout', userController.logout);

// GET - /user/forgot
routes.get('/password/forgot', userController.forgot);

// POST - /user/login
routes.post('/password/forgot', userValidate.forgot, userController.forgotPost);

// GET - /user/password/otp
routes.get('/password/otp', userController.otpPassword);

// POST - /user/password/otp
routes.post('/password/otp', userController.otpPasswordPost);

// GET - /user/password/reset
routes.get('/password/reset', userController.reset);

// POST - /user/password/reset
routes.post('/password/reset', userValidate.reset, userController.resetPost);

module.exports = routes;