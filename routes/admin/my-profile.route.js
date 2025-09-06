const express = require('express');
const routes = express.Router();
const myProfileController = require('../../controllers/admin/myProfile.controller');
const multer = require('multer');
const fileUpload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

routes.get('/', myProfileController.index);

routes.patch('/edit', fileUpload.single('avatar'), uploadCloud.upload, myProfileController.edit);

module.exports = routes;