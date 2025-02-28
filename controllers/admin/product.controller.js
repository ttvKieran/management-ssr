const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchProductHelper = require('../../helpers/searchProduct');
const paginationtHelper = require('../../helpers/pagination');

module.exports.index = async (req, res) => {

    const find = {
        deleted: false
    };

    //Status Product
    if(req.query.status){
        find.status = req.query.status;
    }
    const filterStatus = filterStatusHelper(req.query);
    //End Status Product

    // Pagination
    const totalProduct = await Product.countDocuments(find);
    const paginationProduct = paginationtHelper(
        {
            limit: 5,
            currentPage: 1
        },
        req.query,
        totalProduct
    );
    //End Pagination

    // Search Product
    const searchHelper = searchProductHelper(req.query);
    if(req.query.keyword){
        find.title = searchHelper.regex;
    }
    //End Search

    const products = await Product.find(find).limit(paginationProduct.limit)
    .skip(paginationProduct.skip);

    res.render('admin/pages/product/index', {
        titlePage: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: searchHelper.keyword,
        pagination: paginationProduct
    });
}