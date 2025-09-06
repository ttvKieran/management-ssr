const express = require('express');
const routes = express.Router();
const searchController = require('../../controllers/client/search.controller');

// GET - /search
routes.get('/', searchController.search);

module.exports = routes;