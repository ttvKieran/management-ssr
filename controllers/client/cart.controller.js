const Cart = require('../../models/carts.model');
const Product = require('../../models/products.model');

module.exports.index = async (req, res) => {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    for (const item of cart.products) {
        const product = await Product.findOne({ _id: item.product_id });
        product.totalPrice = product.price * item.quantity;
        item.productDetail = product;
    }
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.productDetail.totalPrice, 0);
    res.render("client/pages/cart/index", {
        titlePage: "Cart Page",
        cart: cart
    });
}

module.exports.addPost = async (req, res) => {
    const quantity = parseInt(req.body.quantity);
    const productId = req.params.productId;
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    const existProducInCart = cart.products.find(item => item.product_id == productId);
    if (existProducInCart) {
        const newQuantity = quantity + existProducInCart.quantity;
        await Cart.updateOne({
            _id: cart.id,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity": newQuantity
            }
        });
        return res.redirect("back");
    } else {
        const objectCart = {
            quantity: quantity,
            product_id: productId
        }
        await Cart.updateOne(
            { _id: cart.id },
            {
                $push: { products: objectCart }
            }
        )
    }
    return res.redirect("back");
}

module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    await Cart.updateOne({
        _id: cartId
    },
        {
            $pull: { products: { product_id: productId } }
        }
    )
    res.redirect("back");
}

module.exports.updateQuantity = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;
    await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId
    }, {
        $set: {
            "products.$.quantity": quantity
        }
    });
    res.redirect("back");
}