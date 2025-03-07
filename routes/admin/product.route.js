const express = require('express');
const routes = express.Router();
const productController = require('../../controllers/admin/product.controller');
const multer = require('multer');
const storageMulter = require('../../helpers/storageMulter');
const upload = multer({ storage: storageMulter() });

// GET - admin/products
routes.get('/', productController.index);

// PATCH - admin/products/change-status
routes.patch('/change-status/:status/:id', productController.changeStatus);

// PATCH - admin/products/chage-multi
routes.patch('/change-multi', productController.changeMulti);

// DELETE - admin/products/delete
routes.delete('/delete/:id', productController.delete);

// GET - admin/products/create
routes.get('/create', productController.createGet);

// POST - admin/products/create
routes.post('/create', upload.single('thumbnail'), productController.createPost);

module.exports = routes;