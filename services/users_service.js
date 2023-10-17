const Constants = require('../utils/Constants/response_messages')
const JWTHelper = require('../utils/Helpers/jwt_helper')

class UserService {
    constructor() {
        this.jwtObject = new JWTHelper();
    }

    async createUser(userdetails) {
        try {
            // If present in the userstatus table or users table: email already exists
            const checkInUserStatus = await global.DATA.MODELS.userstatus.findOne({
                where: {
                    emailId: userdetails.emailId
                }
            }).catch(err => {
                console.log("Error during checking user", err.message)
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
            })

            const checkInUsers = await global.DATA.MODELS.users.findOne({
                where: {
                    emailId: userdetails.emailId
                }
            }).catch(err => {
                console.log("Error during checking user", err.message)
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
            })

            if (checkInUsers || checkInUserStatus) {
                throw new global.DATA.PLUGINS.httperrors.BadRequest("EMAIL ID ALREADY PRESENT")
            }

            // User Id not present
            const password = userdetails.password;
            const confirmpassword = userdetails.confirmpassword;

            if (password !== confirmpassword) {
                throw new global.DATA.PLUGINS.httperrors.BadRequest("PASSWORDS DOES NOT MATCH")
            }

            const randomkey = await global.DATA.PLUGINS.bcrypt.genSalt(10);
            const hashedPassword = await global.DATA.PLUGINS.bcrypt.hash(password, randomkey)

            const userPayload = {
                emailId: userdetails.emailId,
                user_type: userdetails.type,
                password: hashedPassword,
                name: userdetails.name,
                status: "NV",
                role_type: userdetails.type
            }

            const newUser = await global.DATA.MODELS.userstatus.create(userPayload).catch(err => {
                console.log("Error while adding in userstatus table", err.message);
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR);
            });

            return newUser;
        }
        catch (err) {
            throw err;
        }
    }

    async loginUser(userDetails) {
        try {
            const user = await global.DATA.MODELS.users.findOne({
                "where": {
                    emailId: userDetails.emailId
                }
            }).catch(err => {
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
            })

            if (!user) {
                throw new global.DATA.PLUGINS.httperrors.NotFound("User Not Registered")
            }

            const userPassword = user.password;

            const isValid = await global.DATA.PLUGINS.bcrypt.compare(userDetails.password, userPassword);
            if (!isValid) {
                throw new global.DATA.PLUGINS.httperrors.Unauthorized("Email/Password not valid")
            }

            // Valid email and password
            const tokenPayload = user.id.toString() + ":" + user.role_type

            const accessToken = await this.jwtObject.generateAccessToken(tokenPayload);

            const refreshToken = await this.jwtObject.generateRefreshToken(tokenPayload);

            const data = {
                accessToken, refreshToken, "id": user.id, "email": user.emailId
            }
            return data

        }
        catch (err) {
            throw err;
        }
    }
}
module.exports = UserService;