const Constants = require('../utils/Constants/response_messages')

class AdminService {
    constructor() {

    }

    async getUsersList() {
        try {
            const data = await global.DATA.MODELS.userstatus.findAll()
                .catch(err => {
                    console.log("Error while reading the userstatus details", err);
                    throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR);
                })
            return data;
        }
        catch (err) {
            throw err;
        }
    }

    async validateUser(userDetails) {
        try {

            if (userDetails.status === 'R') {
                // Delete from the userstatus table: Reject
                await global.DATA.MODELS.userstatus.destroy({
                    where: {
                        emailId: userDetails.emailId
                    }
                }).catch(err => {
                    throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
                })

            }
            if (userDetails.status === 'V') {
                // Delete from the user status and add to the user table
                await global.DATA.CONNECTION.mysql.transaction(async (t) => {

                    // Get the details from the userstatus table
                    const data = await global.DATA.MODELS.userstatus.findOne({
                        where: {
                            emailId: userDetails.emailId
                        },
                        transaction: t
                    }).catch(err => {
                        throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
                    })

                    // Add to the users table
                    await global.DATA.MODELS.users.create({
                        emailId: data.emailId,
                        password: data.password,
                        name: data.name,
                        role_type: userDetails.role_type,
                        user_type: userDetails.role_type
                    }, {
                        transaction: t
                    }).catch(err => {
                        throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
                    })

                    //Delete from the userstatus table
                    await global.DATA.MODELS.userstatus.destroy({
                        where: {
                            emailId: userDetails.emailId
                        },
                        transaction: t
                    }).catch(err => {
                        throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
                    })

                })
            }
            return "STATUS UPDATED SUCCESSFULLY"

        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = AdminService;