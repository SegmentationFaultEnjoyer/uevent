require("dotenv").config();
const jwt = require("jsonwebtoken");
const { addHours } = require('./date');

function CreateToken(data, type = 'access-token') {
    let token, tokenLifeSpan;

    if (type === 'access-token')
        tokenLifeSpan = process.env.JWT_ACCESS_TOKEN_LIFESPAN;

    else if (type === 'refresh-token')
        tokenLifeSpan = process.env.JWT_REFRESH_TOKEN_LIFESPAN;

    else return null;

    try {
        token = jwt.sign(
            data,
            process.env.JWT_TOKEN,
            {
                expiresIn: tokenLifeSpan,
                subject: type
            })
    } catch (error) {
        console.error(error.message);
        return null;
    }

    return token;
}

async function UpdateTokens(accessTokenData, refreshTokenData) {
    const access_token = CreateToken(accessTokenData);
    const refresh_token = CreateToken(refreshTokenData, 'refresh-token');

    if (access_token == null || refresh_token == null) {
        throw new Error('Error generating tokens')
    }

    const hours = Number(process.env.JWT_REFRESH_TOKEN_LIFESPAN.split(' ')[0]);

    if(hours > 6 && hours < 1) throw new Error('Invalid refresh_token lifespan. Check out README.MD!');

    const tokenLifeSpan = addHours(new Date(), hours);

    const minutes = Number(process.env.JWT_ACCESS_TOKEN_LIFESPAN.split(' ')[0]);

    return { 
        access_token, 
        refresh_token, 
        tokenLifeSpan: tokenLifeSpan.toISOString(),
        access_life: minutes * 60 * 1000,
        refresh_life: hours * 60 * 60 * 1000
    };
}

module.exports = {
    UpdateTokens
}