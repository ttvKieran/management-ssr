const express = require('express');
const routes = express.Router();
const authController = require('../../controllers/admin/auth.controller');

// GET - admin/auth/login
routes.get('/login', authController.login);

// POST - admin/auth/login
routes.post('/login', authController.loginCheck);

// GET - admin/auth/logout
routes.get('/logout', authController.logout);

// GET - admin/auth/refresh-token
routes.get('/refresh-token', authController.refreshToken);

module.exports = routes;