const Product = require('../../models/products.model.js');
const ProductCategory = require('../../models/product-category.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationtHelper = require('../../helpers/pagination');
const configSystem = require("../../configs/system.js");
const Account = require('../../models/accounts.model.js');
const createTreeHelper = require("../../helpers/createTree.js");

module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    //Status 
    if(req.query.status){
        find.status = req.query.status;
    }
    const filterStatus = filterStatusHelper(req.query);
    //End Status

    // Pagination
    const totalRecord = await Product.countDocuments(find);
    const paginationRecord = paginationtHelper(
        {
            limit: 5,
            currentPage: 1
        },
        req.query,
        totalRecord
    );
    //End Pagination

    // Search
    const search = searchHelper(req.query);
    if(req.query.keyword){
        find.title = search.regex;
    }
    //End Search

    //Sort
    const sort = {};
    // {position: "desc"}
    const {sortKey, sortValue} = req.query;
    if(sortKey && sortValue){
        sort[sortKey] = sortValue;
    } else{
        sort.position = "desc";
    }
    //End Sort

    const records = await Product.find(find)
    .limit(paginationRecord.limit)
    .skip(paginationRecord.skip)
    .sort(sort);

    res.render('admin/pages/product/index', {
        titlePage: "Product List",
        products: records,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pagination: paginationRecord
    });
}

module.exports.changeStatus = async(req, res) => {
    const params = req.params;
    const id = params.id;
    const status = params.status;
    const updatedBy = {
        account_id: res.locals.user._id,
        updatedAt: Date.now()
    }
    await Product.updateOne({_id: id}, {status: status, $push: { updatedBy: updatedBy }});
    req.flash('success', 'The product status has been updated successfully.');
    res.redirect('back');
}

module.exports.changeMulti = async(req, res) => {
    const action = req.body.action;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
        account_id: res.locals.user._id,
        updatedAt: Date.now()
    }
    switch(action){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active", $push: { updatedBy: updatedBy }});
            req.flash('success', `The status of ${ids.length} products has been updated successfully.`);
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive", $push: { updatedBy: updatedBy }});
            req.flash('success', `The status of ${ids.length} products has been updated successfully.`);
            break;
        case "delete":
            await Product.updateMany({_id: {$in: ids}}, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user._id,
                    deletedAt: Date.now()
                }
            });
            req.flash('success', `Successfully deleted ${ids.length} products.`);
            break;
        case "position":
            for(item of ids){
                const [id, position] = item.split("-");
                await Product.updateOne({_id: id}, {position: position, $push: { updatedBy: updatedBy }});
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
    const id = params.id;
    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user._id,
            deletedAt: Date.now()
        }
    });
    req.flash('success', 'Successfully deleted product.');
    res.redirect('back');
}

module.exports.createGet = async(req, res) => {
    const find = {
        deleted: false
    };
    const records = await ProductCategory.find(find);
    const recordTree = createTreeHelper.create(records, "");
    res.render('admin/pages/product/create', {
        titlePage: "Create Product",
        records: recordTree
    });
}

module.exports.createPost = async(req, res) => {
    if(!req.body.position){
        const countRecord = await Product.countDocuments();
        req.body.position = countRecord + 1;
    }
    req.body.createdBy = {
        account_id: res.locals.user._id
    }
    const newRecord = new Product(req.body);
    await newRecord.save();

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
        const record = await Product.findOne(find);
        const records = await ProductCategory.find({deleted: false});
        const recordTree = createTreeHelper.create(records, "");
        res.render('admin/pages/product/edit', {
            titlePage: "Edit Product",
            product: record,
            recordTree: recordTree
        });
    } catch (error) {
        req.flash('error', `The product does not exist.`);
        res.redirect(`${configSystem.prefixAdmin}/products`);
        return;
    }
}

module.exports.editPatch = async(req, res) => {
    if(!req.body.position){
        const countRecord = await Product.countDocuments();
        req.body.position = countRecord + 1;
    }

    try {
        const updatedBy = {
            account_id: res.locals.user._id,
            updatedAt: Date.now()
        }
        await Product.updateOne({_id: req.params.id}, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });
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
        const record = await Product.findOne(find);
        const user = await Account.findOne({_id: record.createdBy.account_id});
        res.render('admin/pages/product/detail', {
            titlePage: "Detail Product",
            product: record,
            userCreate: user
        });
    } catch (error) {
        req.flash('error', `The product does not exist.`);
        res.redirect(`${configSystem.prefixAdmin}/products`);
        return;
    }
}