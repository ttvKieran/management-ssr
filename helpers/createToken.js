const authMethodHelper = require('./authMethod');

module.exports.createToken = async (record) => {
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
    return [accessToken, refreshToken];
}