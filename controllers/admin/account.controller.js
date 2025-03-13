const Account = require('../../models/accounts.model.js');
const Role = require('../../models/roles.model.js');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationtHelper = require('../../helpers/pagination');
const configSystem = require("../../configs/system.js");
const bcrypt = require('bcrypt');

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
    const totalRecord = await Account.countDocuments(find);
    const paginationRecord = paginationtHelper(
        {
            limit: 10,
            currentPage: 1
        },
        req.query,
        totalRecord
    );
    //End Pagination
    // Search
    const search = searchHelper(req.query);
    if(req.query.keyword){
        find.fullname = search.regex;
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
    const records = await Account.find(find)
    .limit(paginationRecord.limit)
    .skip(paginationRecord.skip)
    .sort(sort);
    const roles = await Role.find({deleted: false});
    const newRecords = records.map((record) => {
        const role = roles.find(item => item._id == record.role_id);
        record.role = role;
       return record;
    });
    res.render('admin/pages/account/index', {
        titlePage: "Account List",
        accounts: newRecords,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pagination: paginationRecord,
    });
}

module.exports.changeStatus = async(req, res) => {
    const params = req.params;
    const id = params.id;
    const status = params.status;
    await Account.updateOne({_id: id}, {status: status});
    req.flash('success', 'The account status has been updated successfully.');
    res.redirect('back');
}

module.exports.delete = async(req, res) => {
    const params = req.params;
    const id = params.id;
    await Account.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', 'Successfully deleted account.');
    res.redirect('back');
}

module.exports.createGet = async(req, res) => {
    const roles = await Role.find({deleted: false});
    res.render('admin/pages/account/create', {
        titlePage: "Create Account",
        roles: roles
    });
}

module.exports.createPost = async(req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, process.env.SALT_ROUNDS);
        const record = new Account(req.body);
        const existEmail = await Account.findOne({email: record.email});
        if(existEmail){
            req.flash('error', `Email has exist`);
            res.redirect('back');
            return;
        } else{
            await record.save();
        }
    } catch (error) {
        req.flash('error', `Addition failed`);
        res.redirect('back');
        return;
    }
    req.flash('success', `Account added successfully!`);
    res.redirect(`${configSystem.prefixAdmin}/accounts`);
}

module.exports.editGet = async(req, res) => {
    const id = req.params.id;
    const roles = await Role.find({deleted: false});
    const find = {
        deleted: false,
        _id: id
    }
    try {
        const record = await Account.findOne(find);
        res.render('admin/pages/account/edit', {
            titlePage: "Edit Account",
            account: record,
            roles: roles
        });
    } catch (error) {
        req.flash('error', `The account does not exist.`);
        res.redirect(`${configSystem.prefixAdmin}/accounts`);
        return;
    }
}

module.exports.editPatch = async(req, res) => {
    try {
        const existEmail = await Account.find({ _id: {$ne: req.params.id} , email: req.body.email});
        if(existEmail.length > 0){
            req.flash('error', `Email has exist`);
            res.redirect('back');
            return;
        } else{
            if(req.body.password == "") delete req.body.password;
            req.body.password = bcrypt.hashSync(req.body.password, process.env.SALT_ROUNDS);
            await Account.updateOne({_id: req.params.id}, req.body);
        }
    } catch (error) {
        req.flash('error', `The account does not exist.`);
        res.redirect('back');
        return;
    }
    
    req.flash('success', `Account edited successfully!`);
    res.redirect(`back`);
}
