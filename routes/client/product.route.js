const express = require('express');
const routes = express.Router();
const productController = require('../../controllers/client/product.controller');

routes.use('/', productController.index);

routes.use('/create', productController.create);

module.exports = routes;
