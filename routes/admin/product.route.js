const express = require('express');
const routes = express.Router();
const productController = require('../../controllers/admin/product.controller');

routes.get('/', productController.index);

module.exports = routes;