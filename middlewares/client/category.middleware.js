const ProductCategory = require('../../models/product-category.model');
const createTreeHelper = require("../../helpers/createTree.js");
exports.category = async (req, res, next) => {
    const find = {
        deleted: false
    };
    const records = await ProductCategory.find(find);
    const recordTree = createTreeHelper.create(records, "");
    res.locals.productCategory = recordTree;
    next();
};
