const Cart = require('../../models/carts.model');
const Product = require('../../models/products.model');
exports.cartId = async (req, res, next) => {
    if(!req.cookies.cartId){
        const cart = new Cart();
        await cart.save();
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + (365*24*3600*1000))
        });
    }
    else{
        const cart = await Cart.findOne({_id: req.cookies.cartId});
        cart.totalPrice = cart.products.reduce(
            async (accumulator, currentValue) => {
                const product = await Product.findOne({_id: currentValue.product_id});
                return currentValue.quantity*product.price + accumulator; 
            },
            0,
        );
        res.locals.cart = cart;
    }
    next();
};