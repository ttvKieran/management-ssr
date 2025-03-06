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

module.exports.changeStatus = async(req, res) => {
    const params = req.params;
    const idProduct = params.id;
    const statusProduct = params.status;
    await Product.updateOne({_id: idProduct}, {status: statusProduct});
    res.redirect('back');
}

module.exports.changeMulti = async(req, res) => {
    const action = req.body.action;
    const ids = req.body.ids.split(", ");
    switch(action){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"});
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"});
            break;
        case "delete":
            await Product.updateMany({_id: {$in: ids}}, {
                deleted: true,
                deletedAt: new Date()
            });
            break;
        default:
            break;
    }
    res.redirect('back');
}

module.exports.delete = async(req, res) => {
    const params = req.params;
    const idProduct = params.id;
    await Product.updateOne({_id: idProduct}, {
        deleted: true,
        deletedAt: new Date()
    });
    res.redirect('back');
}