const Role = require('../../models/roles.model.js');
const paginationtHelper = require('../../helpers/pagination');
const configSystem = require("../../configs/system.js");

module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };
    // Pagination
    const totalRecord = await Role.countDocuments(find);
    const paginationRecord = paginationtHelper(
        {
            limit: 5,
            currentPage: 1
        },
        req.query,
        totalRecord
    );
    //End Pagination
    const records = await Role.find(find)
    .limit(paginationRecord.limit)
    .skip(paginationRecord.skip)
    res.render(`admin/pages/role/index`, {
        titlePage: "Role List",
        roles: records,
        pagination: paginationRecord
    });
}

module.exports.delete = async(req, res) => {
    const params = req.params;
    const id = params.id;
    try {
        await Role.updateOne({_id: id}, {
            deleted: true,
            deletedAt: new Date()
        });
    } catch (error) {
        req.flash('error', `The role does not exist.`);
        res.redirect('back');
        return;
    }
    req.flash('success', 'Successfully deleted role.');
    res.redirect('back');
}

module.exports.createGet = async(req, res) => {
    res.render('admin/pages/role/create', {
        titlePage: "Create Role"
    });
}

module.exports.createPost = async(req, res) => {
    const record = new Role(req.body);
    try {
        await record.save();
    } catch (error) {
        req.flash('error', `Addition failed`);
        res.redirect('back');
        return;
    }

    req.flash('success', `Role added successfully!`);
    res.redirect(`${configSystem.prefixAdmin}/roles`);
}

module.exports.editGet = async(req, res) => {
    const id = req.params.id;
    const find = {
        deleted: false,
        _id: id
    }
    try {
        const record = await Role.findOne(find);
        res.render('admin/pages/role/edit', {
            titlePage: "Edit Role",
            role: record
        });
    } catch (error) {
        req.flash('error', `The role does not exist.`);
        res.redirect(`${configSystem.prefixAdmin}/roles`);
        return;
    }
}

module.exports.editPatch = async(req, res) => {
    try {
        await Role.updateOne({_id: req.params.id}, req.body);
    } catch (error) {
        req.flash('error', `The role does not exist.`);
        res.redirect('back');
        return;
    }
    
    req.flash('success', `Role edited successfully!`);
    res.redirect(`back`);
}

module.exports.permission = async(req, res) => {
    const find = {
        deleted: false,
    }
    try {
        const roles = await Role.find(find);
        res.render('admin/pages/role/permission', {
            titlePage: "Edit Permission",
            roles: roles
        });
    } catch (error) {
        req.flash('error', `The page does not exist.`);
        res.redirect(`${configSystem.prefixAdmin}/roles`);
        return;
    }
}

module.exports.permissionPatch = async(req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    try {
        permissions.forEach(async permission => {
            if(!("permissions" in permission)) permission.permissions = [];
            await Role.updateOne({_id: permission.id}, {permissions: permission.permissions});
        });
    } catch (error) {
        req.flash('error', `The Permission does not exist.`);
        res.redirect('back');
        return;
    }
    req.flash('success', `Permissions edited successfully!`);
    res.redirect(`${configSystem.prefixAdmin}/roles/permission`);
}