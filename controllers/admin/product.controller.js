const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchProductHelper = require('../../helpers/searchProduct');

module.exports.index = async (req, res) => {

    const find = {
        deleted: false
    };
    if(req.query.status){
        find.status = req.query.status;
    }
    const filterStatus = filterStatusHelper(req.query);

    const searchHelper = searchProductHelper(req.query);
    if(req.query.keyword){
        find.title = searchHelper.regex;
    }

    const products = await Product.find(find);

    res.render('admin/pages/product/index', {
        titlePage: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: searchHelper.keyword
    });
}