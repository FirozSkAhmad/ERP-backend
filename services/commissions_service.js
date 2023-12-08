const createError = require("http-errors");
const { Sequelize } = require("sequelize");
const { SQL_ERROR } = require("../utils/Constants/response_messages");
const CommissionsModel = require('../utils/Models/Commission/CommissionsModel')
const ProjectsModel = require('../utils/Models/Projects/ProjectsModel')
const PayrollModel = require('../utils/Models/Payroll/PayrollModel')

class CommissionService {
    constructor() {

    }

    async getCommissions() {
        try {
            const response = await CommissionsModel.findAll().catch(err => {
                console.log("Error while fetching data", err.message);
                throw createError.InternalServerError(SQL_ERROR);
            })

            const data = (response);
            console.log("View All Commisions", data);
            return data;
        }
        catch (err) {
            throw err;
        }
    }

    async getCancledCommissions() {
        try {
            const response = await global.DATA.MODELS.rejectedcommissions.findAll().catch(err => {
                console.log("Error while fetching data", err.message);
                throw createError.InternalServerError(SQL_ERROR);
            })

            const data = (response);
            console.log("View All Cancled Commisions", data);
            return data;
        }
        catch (err) {
            throw err;
        }
    }

    async validateCommission(payload) {
        // Delete from commission table and add in the projects table
        try {
            await global.DATA.CONNECTION.mysql.transaction(async (t) => {
                const projectId = payload.project_id;
                const amount = payload.commission_amount;
                const project_name = payload.project_name;

                // Add commission amount to the projects table
                await ProjectsModel.update({
                    commission_amount: amount
                }, {
                    where: {
                        project_id: projectId
                    },
                    transaction: t
                }).catch(err => {
                    console.log("Error while updating the project", err);
                    throw createError.InternalServerError(SQL_ERROR);
                });

                // Delete from commission table
                await CommissionsModel.destroy({
                    where: {
                        project_id: projectId
                    },
                    transaction: t
                }).catch(err => {
                    console.log("Error while delete from commission", err);
                    throw createError.InternalServerError(SQL_ERROR);
                });

                await PayrollModel.create({
                    amount: payload.commission_amount,
                    project_id: projectId,
                    name: project_name,
                    project_type: payload.project_type,
                    tower_number: payload.tower_number,
                    flat_number: payload.flat_number,
                    villa_number: payload.villa_number,
                    plot_number: payload.plot_number,
                    role_type: "COMMISSION",
                    payroll_type: "COMMISSION",
                }).catch(err => {
                    console.log("ERROR while inserting into payroll table", err);
                    throw createError.InternalServerError(SQL_ERROR);
                })
            })
        }
        catch (err) {
            throw err;
        }
    }

    async cancelCommission(payload) {
        try {
            await global.DATA.CONNECTION.mysql.transaction(async (t) => {

                const commission_id = payload.project_id;
                const checkExists = await CommissionsModel.findOne({
                    where: {
                        project_id: commission_id
                    }
                }).catch(err => {
                    console.log("Error while finding commission", err);
                    throw createError.NotFound("Commission with given Id Not Found");
                })

                if (checkExists) {
                    await global.DATA.MODELS.rejectedcommissions.create({
                        project_id: checkExists.project_id,
                        project_name: checkExists.project_name,
                        tower_number: checkExists.tower_number,
                        flat_number: checkExists.flat_number,
                        status: checkExists.status,
                        project_type: checkExists.project_type,
                        villa_number: checkExists.villa_number,
                        plot_number: checkExists.plot_number,
                        pid: checkExists.pid,
                        client_name: checkExists.client_name,
                        client_phone: checkExists.client_phone,
                        sales_person: checkExists.sales_person,
                        amount_received: checkExists.amount_received,
                    }, {
                        transaction: t
                    }).catch(err => {
                        console.log(err);
                        throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
                    })

                    await CommissionsModel.destroy({
                        where: {
                            project_id: commission_id
                        },
                        transaction: t
                    }).catch(err => {
                        console.log("error while deleting commission details", err);
                        throw createError.InternalServerError(SQL_ERROR);
                    })

                    return "COMMISSION DELETED SUCCESSFULLY";
                }

            })
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = CommissionService;