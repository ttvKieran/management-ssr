const Product = require('../../models/product.model');

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    });
    const newProducts = products.map((item) => {
        item.newPrice = ((100 - item.discountPercentage)*item.price / 100).toFixed(0);
        return item;
    })
    res.render("client/pages/product/index", {
        titlePage: "Trang danh sách sản phẩm",
        products: newProducts
    });
}

module.exports.create = (req, res) => {
    res.render("client/pages/product/productCreate", {
        titlePage: "Trang tạo mới sản phẩm"
    });
}

module.exports.detail = async (req, res) => {
    const product = await Product.findOne({
        status: "active",
        deleted: false,
        slug: req.params.slug
    });
    res.render("client/pages/product/detail", {
        titlePage: "Detail Product",
        product: product
    });
}