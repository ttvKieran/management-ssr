const User = require('../../models/users.model.js');
const authMethodHelper = require("../../helpers/authMethod.js");
exports.isAuth = async (req, res, next) => {
    const accessToken = req.cookies.accessTokenUser;
    if(accessToken){
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const verified = await authMethodHelper.verifyToken(accessToken, accessTokenSecret);
        if(!verified) {
            const refreshToken = req.cookies.refreshTokenUser;
            if(refreshToken) {
                const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
                const verified = await authMethodHelper.verifyToken(refreshToken, refreshTokenSecret);
                if(verified){
                    const account = await User.findOne({refreshToken: refreshToken});
                    if(account){
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
                        res.cookie("accessTokenUser", accessToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "Strict"
                        });
                    }
                }
            }
        }
        try {
            const user = await User.findOne({_id: verified.payload.id});
            if(user){
                req.user = user;
                res.locals.user = user;
            }
        } catch (error) {
            
        }
    }
    next();
};