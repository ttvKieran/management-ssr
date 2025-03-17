const Account = require('../../models/accounts.model.js');
const configSystem = require("../../configs/system.js");
const bcrypt = require('bcrypt');
const authMethodHelper = require('../../helpers/authMethod.js');
const systemConfig = require('../../configs/system.js');
const randToken = require('rand-token');

module.exports.login = async (req, res) => {
    res.render('admin/pages/auth/login', {
        titlePage: "Login"
    });
}

module.exports.loginCheck = async (req, res) => {
    try {
        const record = await Account.findOne({email: req.body.email});
        if(record){
            const checkPassword = bcrypt.compareSync(req.body.password, record.password);
            if(checkPassword){
                const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
                const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
                const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
                const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
                const dataForAccessToken = {
                    id: record._id
                };
                const accessToken = await authMethodHelper.generateToken(
                    dataForAccessToken,
                    accessTokenSecret,
                    accessTokenLife,
                );
                let refreshToken = await authMethodHelper.generateToken(
                    {},
                    refreshTokenSecret,
                    refreshTokenLife,
                );
                await Account.updateOne({_id: record._id}, {refreshToken: refreshToken});
                res.cookie("accessToken", accessToken, {
                    httpOnly: true, 
                    secure: true,
                    sameSite: "Strict",
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true, 
                    secure: true,
                    sameSite: "Strict",
                });
                req.flash('success', `Account login successfully!`);
                res.redirect(`${configSystem.prefixAdmin}/dashboard`);
                return;
            } else{
                req.flash('error', `Email or password not correct!`);
                res.redirect('back');
                return;
            }
        } else{
            req.flash('error', `Email or password not correct!`);
            res.redirect('back');
            return;
        }
    } catch (error) {
        req.flash('error', `There was an error login the account. Please try again.`);
        res.redirect('back');
        return;
    }
}

// module.exports.register = async (req, res) => {
//     res.render('admin/pages/auth/register', {
//         titlePage: "Register"
//     });
// }

// module.exports.registerPost = async (req, res) => {
//     try {
//         req.body.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS));
//         const record = new Account(req.body);
//         const existEmail = await Account.findOne({email: record.email});
//         if(existEmail){
//             req.flash('error', `Email has exist`);
//             res.redirect('back');
//             return;
//         } else{
//             await record.save();
//         }
//     } catch (error) {
//         req.flash('error', `There was an error creating the account. Please try again.`);
//         res.redirect('back');
//         return;
//     }
//     req.flash('success', `Account registered successfully!`);
//     res.redirect(`${configSystem.prefixAdmin}/dashboard`);
// }


module.exports.logout = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    req.flash('success', `Logout successfully!`);
    res.redirect(`${configSystem.prefixAdmin}/auth/login`);
}

module.exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        req.flash('error', `There was an error login the account. Please try again.`);
        return res.redirect(`${configSystem.prefixAdmin}/auth/login`);
    }
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const verified = await authMethodHelper.verifyToken(refreshToken, refreshTokenSecret);
    if(!verified){
        req.flash('error', `There was an error login the account. Please try again.`);
        return res.redirect(`${configSystem.prefixAdmin}/auth/login`);
    }
    const account = await Account.findOne({refreshToken: refreshToken});
    if(!account){
        req.flash('error', `There was an error login the account. Please try again.`);
        return res.redirect(`${configSystem.prefixAdmin}/auth/login`);
    }
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const dataForAccessToken = {
        id: account._id
    };
    const accessToken = await authMethodHelper.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    });
    res.redirect("back");
};