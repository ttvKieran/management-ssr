const ProductCategory = require('../../models/productCategory.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search.js');
const paginationtHelper = require('../../helpers/pagination');
const configSystem = require("../../configs/system.js");
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
    const totalRecord = await ProductCategory.countDocuments(find);
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

    const records = await ProductCategory.find(find)
    .limit(paginationRecord.limit)
    .skip(paginationRecord.skip)
    .sort(sort);

    const recordTree = createTreeHelper.create(records, "");

    res.render('admin/pages/product-category/index', {
        titlePage: "Product Category",
        productCategory: recordTree,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pagination: paginationRecord
    });
}

module.exports.changeStatus = async(req, res) => {
    const params = req.params;
    const id = params.id;
    const status = params.status;
    await ProductCategory.updateOne({_id: id}, {status: status});
    req.flash('success', 'The product category status has been updated successfully.');
    res.redirect('back');
}

module.exports.changeMulti = async(req, res) => {
    const action = req.body.action;
    const ids = req.body.ids.split(", ");
    switch(action){
        case "active":
            await ProductCategory.updateMany({_id: {$in: ids}}, {status: "active"});
            req.flash('success', `The status of ${ids.length} product category has been updated successfully.`);
            break;
        case "inactive":
            await ProductCategory.updateMany({_id: {$in: ids}}, {status: "inactive"});
            req.flash('success', `The status of ${ids.length} product category has been updated successfully.`);
            break;
        case "delete":
            await ProductCategory.updateMany({_id: {$in: ids}}, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash('success', `Successfully deleted ${ids.length} product category.`);
            break;
        case "position":
            for(item of ids){
                const [id, position] = item.split("-");
                await ProductCategory.updateOne({_id: id}, {position: position});
            }
            req.flash('success', `The position of ${ids.length} product category has been updated successfully.`);
            break;
        default:
            break;
    }
    res.redirect('back');
}

module.exports.delete = async(req, res) => {
    const params = req.params;
    const id = params.id;
    await ProductCategory.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', 'Successfully deleted product category.');
    res.redirect('back');
}

module.exports.createGet = async(req, res) => {
    const find = {
        deleted: false
    };
    const records = await ProductCategory.find(find);
    const recordTree = createTreeHelper.create(records, "");
    res.render('admin/pages/product-category/create', {
        titlePage: "Create Product Category",
        records: recordTree
    });
}

module.exports.createPost = async(req, res) => {
    if(!req.body.position){
        const countRecord = await ProductCategory.countDocuments();
        req.body.position = countRecord + 1;
    }

    const newRecord = new ProductCategory(req.body);
    await newRecord.save();

    req.flash('success', `Product Category added successfully!`);
    res.redirect(`${configSystem.prefixAdmin}/product-category`);
}

module.exports.editGet = async(req, res) => {
    const id = req.params.id;
    const find = {
        deleted: false,
        _id: id
    }
    try {
        const record = await ProductCategory.findOne(find);
        const records = await ProductCategory.find({deleted: false});
        const recordTree = createTreeHelper.create(records, "");
        res.render('admin/pages/product-category/edit', {
            titlePage: "Edit Product Category",
            productCategory: record,
            recordTree: recordTree
        });
    } catch (error) {
        req.flash('error', `The product category does not exist.`);
        res.redirect(`${configSystem.prefixAdmin}/product-category`);
        return;
    }
}

module.exports.editPatch = async(req, res) => {
    if(!req.body.position){
        const countRecord = await ProductCategory.countDocuments();
        req.body.position = countRecord + 1;
    }

    try {
        await ProductCategory.updateOne({_id: req.params.id}, req.body);
    } catch (error) {
        req.flash('error', `The product category does not exist.`);
        res.redirect('back');
        return;
    }
    
    req.flash('success', `Product category edited successfully!`);
    res.redirect(`back`);
}

module.exports.detail = async(req, res) => {
    const id = req.params.id;
    const find = {
        deleted: false,
        _id: id
    }
    try {
        const record = await ProductCategory.findOne(find);
        let record_parent = {title: "No have parent"};
        if(record.parent_id){
            record_parent = await ProductCategory.findOne({_id: record.parent_id});
        }
        res.render('admin/pages/product-category/detail', {
            titlePage: "Detail Product Category",
            productCategory: record,
            parent_category: record_parent
        });
    } catch (error) {
        req.flash('error', `The product category does not exist.`);
        res.redirect(`${configSystem.prefixAdmin}/product-category`);
        return;
    }
}