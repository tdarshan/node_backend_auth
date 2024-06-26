const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {

    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {

            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '1d',
                issuer: 'tDarshan',
                audience: userId
            };

            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    // reject(err);
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    },
    verifyAccessToken : (req, res, next) => {

        if(!req.headers['authorization']){
            return next(createError.Unauthorized());
        }
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(" ");
        const token = bearerToken[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err){
                // return next(createError.Unauthorized());
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            // console.log(req.payload.aud);
            req.id = req.payload.aud;
            next();
        });
    }, 
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {

            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'tDarshan',
                audience: userId
            };

            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    // reject(err);
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    },

    verifyRefreshToken: (refreshToken) => {

        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if(err){
                    return reject(createError.Unauthorized());
                }
                const userId = payload.aud;

                resolve(userId);
            });
        });
    }
}