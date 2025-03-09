const express = require('express');
const routes = express.Router();
const productController = require('../../controllers/admin/product.controller');
const multer = require('multer');
const fileUpload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const productValidate = require('../../validates/productValidate');

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
routes.post('/create', 
    fileUpload.single('thumbnail'),
    uploadCloud.upload,
    productValidate.createValidate,
    productController.createPost
);

// GET - admin/products/edit
routes.get('/edit/:id', productController.editGet);

// PATCH - admin/products/edit
routes.patch('/edit/:id', 
    fileUpload.single('thumbnail'), 
    uploadCloud.upload,
    productValidate.createValidate,
    productController.editPatch
);

// GET - admin/products/detail/:id
routes.get('/detail/:id', productController.detail);

module.exports = routes;