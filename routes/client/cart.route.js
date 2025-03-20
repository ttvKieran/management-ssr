const express = require('express');
const routes = express.Router();
const cartController = require('../../controllers/client/cart.controller');

// GET /cart
routes.get('/', cartController.index);

// POST /cart/add/:productId
routes.post('/add/:productId', cartController.addPost);

// DELETE /cart/delete/:productId
routes.get('/delete/:productId', cartController.delete);

// GET /cart/update/:productId/:quantity
routes.get('/update/:productId/:quantity', cartController.updateQuantity);

module.exports = routes;