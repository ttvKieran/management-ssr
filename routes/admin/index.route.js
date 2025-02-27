const express = require('express');
const productRoutes = require('./product.route');
const dashboardRoutes = require('./dashboard.route');
const { prefixAdmin } = require('../../configs/system');

module.exports = (app) => {
    app.use(prefixAdmin + '/dashboard', dashboardRoutes);
    app.use(prefixAdmin + '/products', productRoutes);
}