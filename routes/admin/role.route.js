const express = require('express');
const routes = express.Router();
const roleController = require('../../controllers/admin/role.controller');
const roleValidate = require('../../validates/roleValidate');

// GET - admin/roles
routes.get('/', roleController.index);

// DELETE - admin/roles/delete
routes.delete('/delete/:id', roleController.delete);

// GET - admin/roles/create
routes.get('/create', roleController.createGet);

// POST - admin/roles/create
routes.post('/create', roleValidate.createValidate, roleController.createPost);

// GET - admin/roles/edit
routes.get('/edit/:id', roleController.editGet);

// PATCH - admin/roles/edit
routes.patch('/edit/:id', roleValidate.createValidate, roleController.editPatch);

// // GET - admin/roles/permission
routes.get('/permission', roleController.permission);

// // PATCH - admin/roles/permission
routes.patch('/permission', roleController.permissionPatch);

module.exports = routes;