const express = require('express');
const routes = express.Router();
const productController = require('../../controllers/admin/product.controller');

// GET - admin/products
routes.get('/', productController.index);

// PATCH - admin/products/change-status
routes.patch('/change-status/:status/:id', productController.changeStatus);

// PATCH - admin/products/chage-multi
routes.patch('/change-multi', productController.changeMulti);

// DELETE - admin/products/delete
routes.delete('/delete/:id', productController.delete);

module.exports = routes;