const Product = require('../../models/products.model');
module.exports.search = async (req, res) => {
    const find = {
        status: "active",
        deleted: false
    }
    const keyword = req.query.keyword;
    const search = {
        keyword: ""
    }
    if(keyword){
        search.keyword = keyword;
        const regex = RegExp(search.keyword, "i");
        search.regex = regex;
    }
    if(keyword){
        find.title = search.regex;
    }
    const products = await Product.find(find);
    res.render("client/pages/product/index", {
        titlePage: "Product",
        products: products,
        keyword: keyword
    });
}