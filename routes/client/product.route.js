const express = require('express');
const routes = express.Router();
const productController = require('../../controllers/client/product.controller');

// GET - /products
routes.get('/', productController.index);

// GET - /products/detail/:slug
routes.get('/detail/:slug', productController.detail);

// GET - /products/create
routes.get('/create', productController.create);

module.exports = routes;
