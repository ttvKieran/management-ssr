const Product = require('../../models/products.model');
const ProductCategory = require('../../models/product-category.model');

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
        titlePage: "Product List",
        products: newProducts
    });
}

module.exports.detail = async (req, res) => {
    const product = await Product.findOne({
        status: "active",
        deleted: false,
        slug: req.params.slug
    });
    const category = await ProductCategory.findOne({
        status: "active",
        deleted: false,
        _id: product.category_id
    });
    product.category = category;
    res.render("client/pages/product/detail", {
        titlePage: "Detail Product",
        product: product
    });
}

module.exports.category = async (req, res) => {
    try {
        const category = await ProductCategory.findOne({
            status: "active",
            deleted: false,
            slug: req.params.slugCategory
        });
        const products = await Product.find({
            status: "active",
            deleted: false,
            category_id: category._id
        });
        res.render("client/pages/product/index", {
            titlePage: category.title,
            products: products
        });
    } catch (error) {
        res.redirect("/");
    }
}