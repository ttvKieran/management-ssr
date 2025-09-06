const express = require('express');
const routes = express.Router();
const chatController = require('../../controllers/client/chat.controller');
const authMiddleware = require('../../middlewares/client/auth.middleware');

// GET /chat
routes.get('/', authMiddleware.requireAuth, chatController.index);

module.exports = routes;