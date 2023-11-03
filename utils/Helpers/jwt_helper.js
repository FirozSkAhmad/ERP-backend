const Constants = require('../Constants/response_messages')
class JWTHelper {
    constructor() {

    }

    async generateAccessToken(tokenPayload) {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRETKEY
            const options = {
                expiresIn: '1y',
                issuer: 'vrcapplication',
                audience: tokenPayload,
            }
            global.DATA.PLUGINS.jsonwebtoken.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.JWT_SIGN_ERROR))
                    return
                }
                resolve(token)
            })
        })
    }

    async generateRefreshToken(tokenPayload) {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRETKEY
            const options = {
                expiresIn: '1y',
                issuer: 'vrcapplication',
                audience: tokenPayload,
            }
            global.DATA.PLUGINS.jsonwebtoken.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.JWT_SIGN_ERROR))
                    return
                }
                resolve(token)
            })
        })
    }
    verifyAccessToken(req, res, next) {
        if (!req.headers['authorization']) return next(new global.DATA.PLUGINS.httperrors.Unauthorized("Please provide token"))
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        global.DATA.PLUGINS.jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRETKEY, (err, payload) => {
            if (err) {
                return next(new global.DATA.PLUGINS.httperrors.Unauthorized("Token Invalid/Expired"))
            }
            next();
        })
    }
}

module.exports = JWTHelper;
