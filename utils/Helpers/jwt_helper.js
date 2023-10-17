class JWTHelper {
    constructor() {

    }

    async generateAccessToken(tokenPayload) {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRETKEY
            const options = {
                expiresIn: '10m',
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

    async verifyToken() {

    }
}

module.exports = JWTHelper;