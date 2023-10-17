const Constants = require('../utils/Constants/response_messages')

class AdminService {
    constructor() {

    }

    async getUsersList() {
        try {
            const data = await global.DATA.MODELS.userstatus.findAll()
                .catch(err => {
                    console.log("Error while reading the userstatus details", err);
                    throw new global.DATA.PLUGINS.httperrors.INTERNAL_SERVER_ERROR(Constants.SQL_ERROR);
                })
            return data;
        }
        catch (err) {
            throw err;
        }
    }

    async validateUser(userDetails) {
        try {
            // check if already verified
            const data = await global.DATA.MODELS.userstatus.findOne({
                where: {
                    "emailId": userDetails.emailId
                }
            }).catch(err => {
                throw new global.DATA.PLUGINS.httperrors.INTERNAL_SERVER_ERROR(Constants.SQL_ERROR)
            })

            if (data.status === "V") {
                throw new global.DATA.PLUGINS.httperrors.BadRequest("USER ALREADY VERIFIED")
            }

            // Update status and add to the user table
            await global.DATA.CONNECTION.mysql.transaction(async (t) => {

                await global.DATA.MODELS.userstatus.update({
                    status: "V"
                }, {
                    where: {
                        emailId: userDetails.emailId
                    },
                    transaction: t
                }).catch(err => {
                    throw new global.DATA.PLUGINS.httperrors.INTERNAL_SERVER_ERROR(Constants.SQL_ERROR)
                })

                await global.DATA.MODELS.users.create({
                    emailId: data.emailId,
                    password: data.password,
                    name: data.name,
                    role_type: data.role_type,
                    user_type: data.user_type
                }, {
                    transaction: t
                }).catch(err => {
                    throw new global.DATA.PLUGINS.httperrors.INTERNAL_SERVER_ERROR(Constants.SQL_ERROR)
                })

            })

        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = AdminService;