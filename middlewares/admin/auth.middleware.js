const Account = require('../../models/accounts.model.js');
const Role = require('../../models/roles.model.js');
const configSystem = require("../../configs/system.js");
const authMethodHelper = require("../../helpers/authMethod.js")
exports.isAuth = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken) {
        req.flash('error', `There was an error login the account. Please try login again.`);
        return res.redirect(`${configSystem.prefixAdmin}/auth/login`);
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const verified = await authMethodHelper.verifyToken(accessToken, accessTokenSecret);
    if(!verified) {
        return res.redirect(`${configSystem.prefixAdmin}/auth/refresh-token`);
        // req.flash('error', `Account not exist.`);
        // return res.redirect(`${configSystem.prefixAdmin}/auth/login`);
    }
    console.log("This is verified", verified);
    const account = await Account.findOne({_id: verified.payload.id});
    if(!account){
        req.flash('error', `Account not exist.`);
        return res.redirect(`${configSystem.prefixAdmin}/auth/login`);
    }
    else req.account = account;
    const role = await Role.findOne({_id: account.role_id});
    account.role = role;
    res.locals.user = account;
    next();
};
