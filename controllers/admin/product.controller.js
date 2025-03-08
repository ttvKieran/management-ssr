const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchProductHelper = require('../../helpers/searchProduct');
const paginationtHelper = require('../../helpers/pagination');
const configSystem = require("../../configs/system.js");

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

    const products = await Product.find(find)
    .limit(paginationProduct.limit)
    .skip(paginationProduct.skip)
    .sort({position: "desc"});

    res.render('admin/pages/product/index', {
        titlePage: "Product List",
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
    req.flash('success', 'The product status has been updated successfully.');
    res.redirect('back');
}

module.exports.changeMulti = async(req, res) => {
    const action = req.body.action;
    const ids = req.body.ids.split(", ");
    switch(action){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"});
            req.flash('success', `The status of ${ids.length} products has been updated successfully.`);
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"});
            req.flash('success', `The status of ${ids.length} products has been updated successfully.`);
            break;
        case "delete":
            await Product.updateMany({_id: {$in: ids}}, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash('success', `Successfully deleted ${ids.length} products.`);
            break;
        case "position":
            for(item of ids){
                const [id, position] = item.split("-");
                await Product.updateOne({_id: id}, {position: position});
            }
            req.flash('success', `The position of ${ids.length} products has been updated successfully.`);
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
    req.flash('success', 'Successfully deleted product.');
    res.redirect('back');
}

module.exports.createGet = async(req, res) => {
    res.render('admin/pages/product/create', {
        titlePage: "Create Product"
    });
}

module.exports.createPost = async(req, res) => {
    if(!req.body.position){
        const countProduct = await Product.countDocuments();
        req.body.position = countProduct + 1;
    }
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const newProduct = new Product(req.body);
    await newProduct.save();

    req.flash('success', `Product added successfully!`);
    res.redirect(`${configSystem.prefixAdmin}/products`);
}

module.exports.editGet = async(req, res) => {
    const id = req.params.id;
    const find = {
        deleted: false,
        _id: id
    }
    try {
        const product = await Product.findOne(find);
        res.render('admin/pages/product/edit', {
            titlePage: "Edit Product",
            product: product
        });
    } catch (error) {
        req.flash('error', `The product does not exist.`);
        res.redirect(`${configSystem.prefixAdmin}/products`);
        return;
    }
}

module.exports.editPatch = async(req, res) => {
    if(!req.body.position){
        const countProduct = await Product.countDocuments();
        req.body.position = countProduct + 1;
    }
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({_id: req.params.id}, req.body);
    } catch (error) {
        req.flash('error', `The product does not exist.`);
        res.redirect('back');
        return;
    }
    
    req.flash('success', `Product edited successfully!`);
    res.redirect(`back`);
}

module.exports.detail = async(req, res) => {
    const id = req.params.id;
    const find = {
        deleted: false,
        _id: id
    }
    try {
        const product = await Product.findOne(find);
        res.render('admin/pages/product/detail', {
            titlePage: "Detail Product",
            product: product
        });
    } catch (error) {
        req.flash('error', `The product does not exist.`);
        res.redirect(`${configSystem.prefixAdmin}/products`);
        return;
    }
}