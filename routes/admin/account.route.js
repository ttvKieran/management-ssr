const express = require('express');
const routes = express.Router();
const accountController = require('../../controllers/admin/account.controller');
const multer = require('multer');
const fileUpload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const accountValidate = require('../../validates/accountValidate');

// GET - admin/accounts
routes.get('/', accountController.index);

// PATCH - admin/accounts/change-status
routes.patch('/change-status/:status/:id', accountController.changeStatus);

// // DELETE - admin/accounts/delete
routes.delete('/delete/:id', accountController.delete);

// GET - admin/accounts/create
routes.get('/create', accountController.createGet);

// POST - admin/accounts/create
routes.post('/create', 
    fileUpload.single('avatar'),
    uploadCloud.upload,
    accountValidate.createValidate,
    accountController.createPost
);

// GET - admin/accounts/edit
routes.get('/edit/:id', accountController.editGet);

// PATCH - admin/accounts/edit
routes.patch('/edit/:id', 
    fileUpload.single('avatar'), 
    uploadCloud.upload,
    accountValidate.updateValidate,
    accountController.editPatch
);

module.exports = routes;


// Các dependencies cần thiết
// bcrypt: Mã hóa mật khẩu.
// lowdb: Mình dùng file json để lưu data nên dùng package này để query đata.
// jsonwebtoken: phát sinh, verify access token
// rand-token: phát sinh ra 1 chuỗi ngẫu nhiên và duy nhất, ở đây mình dùng để phát sinh refresh token.