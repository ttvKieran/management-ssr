const express = require('express');
const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');
const searchRoutes = require('./search.route');
const categoryMiddleware = require('../../middlewares/client/category.middleware');
const cartMiddleware = require('../../middlewares/client/cart.middleware');
const cartRoutes = require('./cart.route');

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use('/', homeRoutes);
    app.use('/products', productRoutes);
    app.use('/search', searchRoutes);
    app.use('/cart', cartRoutes);
}