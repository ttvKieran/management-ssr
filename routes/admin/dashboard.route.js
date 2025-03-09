const express = require('express');
const routes = express.Router();
const dashboardController = require('../../controllers/admin/dashboard.controller');

routes.get('/', dashboardController.index);

module.exports = routes;
