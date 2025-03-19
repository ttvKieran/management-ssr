const Product = require('../../models/products.model');
module.exports.index = async (req, res) => {
    const findProductFeatured = {
        deleted: false,
        status: "active",
        featured: "1"
    };
    const productFeatured = await Product.find(findProductFeatured).limit(10);
    const findLastestProduct = {
        deleted: false,
        status: "active"
    };
    const lastestProduct = await Product.find(findLastestProduct).sort({position: "desc"}).limit(10);
    res.render("client/pages/home/index", {
        titlePage: "Home",
        productFeatured: productFeatured,
        lastestProduct: lastestProduct
    });
}


