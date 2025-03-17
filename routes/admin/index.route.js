const express = require('express');
const productRoutes = require('./product.route');
const dashboardRoutes = require('./dashboard.route');
const productCategoryRoutes = require('./product-category.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const myProfileRoutes = require('./my-profile.route');
const { prefixAdmin } = require('../../configs/system');
const authMiddleware = require('../../middlewares/admin/auth.middleware');

module.exports = (app) => {
    app.use(prefixAdmin + '/dashboard', authMiddleware.isAuth, dashboardRoutes);
    app.use(prefixAdmin + '/products', authMiddleware.isAuth, productRoutes);
    app.use(prefixAdmin + '/product-category', authMiddleware.isAuth, productCategoryRoutes);
    app.use(prefixAdmin + '/roles', authMiddleware.isAuth, roleRoutes);
    app.use(prefixAdmin + '/accounts', authMiddleware.isAuth, accountRoutes);
    app.use(prefixAdmin + '/auth', authRoutes);
    app.use(prefixAdmin + '/my-profile', authMiddleware.isAuth, myProfileRoutes);
}