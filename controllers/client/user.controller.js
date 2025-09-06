const User = require('../../models/users.model.js');
const Cart = require('../../models/carts.model.js');
const bcrypt = require('bcrypt');
const authMethodHelper = require('../../helpers/authMethod.js');
const createTokenHelper = require('../../helpers/createToken.js');
const generateHelper = require('../../helpers/generate.js');
const sendMailHelper = require('../../helpers/sendMail.js');
const randToken = require('rand-token');
const ForgotPassword = require('../../models/forgot-password.model.js');

module.exports.login = async (req, res) => {
    res.render('client/pages/user/login', {
        titlePage: "Login"
    });
}

module.exports.loginCheck = async (req, res) => {
    try {
        const record = await User.findOne({email: req.body.email});
        if(record){
            const checkPassword = bcrypt.compareSync(req.body.password, record.password);
            if(checkPassword){
                const [accessToken, refreshToken] = await createTokenHelper.createToken(record);
                await User.updateOne({_id: record._id}, {refreshToken: refreshToken});
                res.cookie("accessTokenUser", accessToken, {
                    httpOnly: true, 
                    secure: true,
                    sameSite: "Strict",
                });
                res.cookie("refreshTokenUser", refreshToken, {
                    httpOnly: true, 
                    secure: true,
                    sameSite: "Strict",
                });
                await Cart.updateOne({
                    _id: req.cookies.cartId
                }, {
                    user_id: record.id
                })
                req.flash('success', `Account login successfully!`);
                res.redirect(`/`);
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

module.exports.register = async (req, res) => {
    res.render('client/pages/user/register', {
        titlePage: "Register"
    });
}

module.exports.registerPost = async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS));
        const record = new User(req.body);
        const existEmail = await User.findOne({email: record.email});
        if(existEmail){
            req.flash('error', `Email has exist`);
            res.redirect('back');
            return;
        } else{
            const [accessToken, refreshToken] = await createTokenHelper.createToken(record);
            record.refreshToken = refreshToken;
            await record.save();
        }
    } catch (error) {
        req.flash('error', `There was an error creating the account. Please try again.`);
        res.redirect('back');
        return;
    }
    req.flash('success', `Account registered successfully!`);
    res.redirect(`/`);
}

module.exports.logout = async (req, res) => {
    res.clearCookie("accessTokenUser");
    res.clearCookie("refreshTokenUser");
    req.flash('success', `Logout successfully!`);
    return res.redirect(`/user/login`);
}

module.exports.forgot = async (req, res) => {
    res.render('client/pages/user/forgot', {
        titlePage: "Forgot Password"
    });
}

module.exports.forgotPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        deleted: false,
        email: email
    });
    if(!user){
        req.flash('error', `Email not exist!`);
        return res.redirect(`back`);
    }
    const otp = generateHelper.generateNumber(8);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAt: new Date()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    
    // Send OTP email
    const subject = "Verification Code";
    const html = `
        <p>Hello,</p>
        <p>Your one-time password (OTP) is:</p>
        <p><b>${otp}<b></p>
        <p>This code is valid for 3 minutes. Do not share it with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you!</p>
    `;
    sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
}

module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        titlePage: "OTP",
        email: email
    })
}

module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const check = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });
    if(!check){
        req.flash('error', `Invalid OTP!`);
        res.redirect(`back`);
        return;
    }
    const record = await User.findOne({email: email});
    const [accessToken, refreshToken] = await createTokenHelper.createToken(record);
    await User.updateOne({_id: record._id}, {refreshToken: refreshToken});
    res.cookie("accessTokenUser", accessToken, {
        httpOnly: true, 
        secure: true,
        sameSite: "Strict",
    });
    res.cookie("refreshTokenUser", refreshToken, {
        httpOnly: true, 
        secure: true,
        sameSite: "Strict",
    });
    res.redirect("/user/password/reset");
}

module.exports.reset = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        titlePage: "Reset Password",
    })
}

module.exports.resetPost = async (req, res) => {
    const password = req.body.password;
    const refreshToken = req.cookies.refreshTokenUser;
    await User.updateOne({
        refreshToken: refreshToken
    }, {
        password: bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS))
    });
    res.redirect("/");
}