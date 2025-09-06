const express = require('express');
const routes = express.Router();
const productCategoryController = require('../../controllers/admin/productCategory.controller');
const productCategoryValidate = require('../../validates/productCategoryValidate');
const multer = require('multer');
const fileUpload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

// GET - admin/product-category
routes.get('/', productCategoryController.index);

// PATCH - admin/product-category/change-status
routes.patch('/change-status/:status/:id', productCategoryController.changeStatus);

// PATCH - admin/product-category/chage-multi
routes.patch('/change-multi', productCategoryController.changeMulti);

// DELETE - admin/product-category/delete
routes.delete('/delete/:id', productCategoryController.delete);

// GET - admin/product-category/create
routes.get('/create', productCategoryController.createGet);

// POST - admin/product-category/create
routes.post('/create', 
    fileUpload.single('thumbnail'),
    uploadCloud.upload,
    productCategoryValidate.createValidate,
    productCategoryController.createPost
);

// GET - admin/product-category/edit
routes.get('/edit/:id', productCategoryController.editGet);

// PATCH - admin/product-category/edit
routes.patch('/edit/:id', 
    fileUpload.single('thumbnail'), 
    uploadCloud.upload,
    productCategoryValidate.createValidate,
    productCategoryController.editPatch
);

// GET - admin/product-category/detail/:id
routes.get('/detail/:id', productCategoryController.detail);

module.exports = routes;