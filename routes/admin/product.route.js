const express = require('express');
const routes = express.Router();
const productController = require('../../controllers/admin/product.controller');

// GET - admin/products
routes.get('/', productController.index);

// PATCH - admin/products/change-status
routes.patch('/change-status/:status/:id', productController.changeStatus);

// PATCH - admin/products/chage-multi-status
routes.patch('/change-multi-status', productController.changeMultiStatus);

module.exports = routes;