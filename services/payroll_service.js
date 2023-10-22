const Constants = require('../utils/Constants/response_messages')

class PayrollService {
    constructor() {

    }

    async addNewPayRollDetails(payrollDetails) {
        try {
            const data = await global.DATA.MODELS.payroll.create(payrollDetails)
                .catch(err => {
                    console.log("Error while saving payroll details", err);
                    throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR);
                })
            return data;
        }
        catch (err) {
            throw err;
        }
    }

    async editPayRollDetails(payroll_id, payrollDetails) {
        try {
            if (!payroll_id) {
                throw new global.DATA.PLUGINS.httperrors.InternalServerError("Payroll Id cannot be empty");
            }

            const data = await global.DATA.MODELS.payroll.update({
                ...payrollDetails
            }, {
                where: {
                    id: payroll_id
                }
            }).catch(err => {
                console.log("Error while updating payroll details", err);
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR);
            })
        }
        catch (err) {
            throw err;
        }
    }

    async getPayRollDetails() {
        try {
            const data = await await global.DATA.MODELS.payroll.findAll().catch(err => {
                console.log("Error while fetching payroll data", err);
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR);
            });
            return data;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    async deletePayRollDetails() {

    }
}

module.exports = PayrollService;