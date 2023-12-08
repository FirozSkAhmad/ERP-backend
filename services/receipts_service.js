const createError = require('http-errors')
const { SQL_ERROR } = require('../utils/Constants/response_messages')
const { Sequelize } = require('sequelize');
const ReceiptsModel = require('../utils/Models/Receipts/ReceiptsModel');
const ProjectsModel = require('../utils/Models/Projects/ProjectsModel');
const CommissionsModel = require('../utils/Models/Commission/CommissionsModel');
const Constants = require('../utils/Constants/response_messages')


class ReceiptServices {
    constructor() {

    }

    async createReceipt(payload) {
        try {

            let payloadIdentifierCheck;
            let checkProjectName = (payload.project_name).split('').join('');
            let checkProjectType = (payload.project_type).split('').join('');
            if (checkProjectType === 'Apartment') {
                let checkProjectTowerNumber = (payload.tower_number).split('').join('');
                let checkProjectFlatNumber = (payload.flat_number).split('').join('');
                payloadIdentifierCheck = checkProjectName + '_' + checkProjectType + '_' + checkProjectTowerNumber + '_' + checkProjectFlatNumber;
            }
            else if (checkProjectType === 'Villa') {
                let checkProjectVillaNumber = (payload.villa_number).split('').join('');
                payloadIdentifierCheck = checkProjectName + '_' + checkProjectType + '_' + checkProjectVillaNumber;
            }
            else if (checkProjectType === 'Plot') {
                let checkProjectPlotNumber = (payload.plot_number).split('').join('');
                payloadIdentifierCheck = checkProjectName + '_' + checkProjectType + '_' + checkProjectPlotNumber;
            }
            else {
                throw createError.BadRequest("Provide Correct Project Type");
            }

            console.log('payloadIdentifierCheck:', payloadIdentifierCheck);
            const checkReceipt = await DATA.CONNECTION.mysql.query(`select status, project_id from projects where pid='${payloadIdentifierCheck}'`, {
                type: Sequelize.QueryTypes.SELECT
            }).catch(err => {
                console.log("Error while fetching data", err.message);
                throw createError.InternalServerError(SQL_ERROR);
            })
            console.log(checkReceipt);
            if (!checkReceipt[0]) {
                throw createError.BadRequest("Provided Project is not Available to Onboard the Client")
            }
            console.log('checkReceipt:', checkReceipt[0]?.status);
            let selectedProjectId = checkReceipt[0]?.project_id;
            if (checkReceipt[0].status !== 'AVAILABLE') {
                throw createError.BadRequest("Provided Project is not Available to Onboard the Client")
            }

            // Check in Receipts table whether project receipt is present or not
            const checkReceiptAlready = await ReceiptsModel.findOne({
                where: {
                    project_id: selectedProjectId
                }
            }).catch(err => {
                console.log("Error", err.message)
                throw createError.InternalServerError(SQL_ERROR)
            })

            if (checkReceiptAlready) {
                throw createError.Conflict("Receipt already created for current project");
            }

            //create a receipt 
            let toBeCreatedReceipt = { ...payload, pid: payloadIdentifierCheck, project_id: selectedProjectId }
            const newlyCreatedReceiptData = await ReceiptsModel.create(toBeCreatedReceipt)
                .catch(err => {
                    console.log("Error while creating a receipt", err.message)
                    throw err;
                })

            return newlyCreatedReceiptData;

        } catch (err) {
            throw err;
        }
    }

    async validateReceipt(payload) {
        try {

            // change status of project , add amount to income , remove from receipts table
            await global.DATA.CONNECTION.mysql.transaction(async (t) => {

                // update projects table
                await global.DATA.MODELS.projects.update({
                    status: payload.status,
                    client_name: payload.client_name,
                    client_phone: payload.client_phone,
                    sales_person: payload.sales_person,
                    amount_received: payload.amount_received
                }, {
                    where: {
                        project_id: payload.project_id
                    },
                    transaction: t
                }).catch(err => {
                    throw createError.InternalServerError(SQL_ERROR);
                })

                // Get the details from the receipts table
                const data = await global.DATA.MODELS.receipts.findOne({
                    where: {
                        project_id: payload.project_id
                    },
                    transaction: t
                }).catch(err => {
                    console.log(err);
                    throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
                })

                // Add to the rejectedreceipts table
                await global.DATA.MODELS.approvedreceipts.create({
                    project_id: data.project_id,
                    project_name: data.project_name,
                    tower_number: data.tower_number,
                    flat_number: data.flat_number,
                    status: data.status,
                    project_type: data.project_type,
                    villa_number: data.villa_number,
                    plot_number: data.plot_number,
                    pid: data.pid,
                    client_name: data.client_name,
                    client_phone: data.client_phone,
                    sales_person: data.sales_person,
                    amount_received: data.amount_received
                }, {
                    transaction: t
                }).catch(err => {
                    console.log(err);
                    throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
                })


                //Delete from the receipts table
                await global.DATA.MODELS.receipts.destroy({
                    where: {
                        project_id: payload.project_id
                    },
                    transaction: t
                }).catch(err => {
                    throw createError.InternalServerError(SQL_ERROR);
                })


                //Add Amount to Income table
                let toBeCreatedIncome = {
                    project_id: payload.project_id,
                    status: payload.status,
                    client_name: payload.client_name,
                    client_phone: payload.client_phone,
                    sales_person: payload.sales_person,
                    amount_received: payload.amount_received,
                }

                await global.DATA.MODELS.income.create(toBeCreatedIncome, {
                    transaction: t
                }).catch(err => {
                    throw createError.InternalServerError(SQL_ERROR);
                })

                // Add to the commission table
                const projectData = await ProjectsModel.findOne({
                    where: {
                        project_id: payload.project_id
                    }
                }).catch(err => {
                    console.log("Error while fetching data from project model", err);
                    throw createError.InternalServerError(SQL_ERROR);
                })
                console.log('projectdata get:', projectData);
                if (projectData.dataValues) {
                    let commisionEntryData = {
                        project_id: projectData.dataValues.project_id,
                        project_name: projectData.dataValues.project_name,
                        tower_number: projectData.dataValues.tower_number,
                        flat_number: projectData.dataValues.flat_number,
                        status: projectData.dataValues.status,
                        project_type: projectData.dataValues.project_type,
                        villa_number: projectData.dataValues.villa_number,
                        plot_number: projectData.dataValues.plot_number,
                        pid: projectData.dataValues.pid,
                    }

                    let newData = {
                        ...commisionEntryData,
                        project_id: payload.project_id,
                        status: payload.status,
                        client_name: payload.client_name,
                        client_phone: payload.client_phone,
                        sales_person: payload.sales_person,
                        amount_received: payload.amount_received
                    }

                    console.log('newData get:', newData);

                    await CommissionsModel.create(newData).catch(err => {
                        console.log("Error while inserting into commissions model", err);
                        throw createError.InternalServerError(SQL_ERROR);
                    })
                }

            })

            return "APPROVED RECEIPT SUCCESSFULLY"

        } catch (err) {
            throw err;
        }
    }

    async rejectReceipt(payload) {
        try {

            // just remove from receipts table
            await global.DATA.CONNECTION.mysql.transaction(async (t) => {

                // Get the details from the receipts table
                const data = await global.DATA.MODELS.receipts.findOne({
                    where: {
                        project_id: payload.project_id
                    },
                    transaction: t
                }).catch(err => {
                    console.log(err);
                    throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
                })
                // Add to the rejectedreceipts table
                await global.DATA.MODELS.rejectedreceipts.create({
                    project_id: data.project_id,
                    project_name: data.project_name,
                    tower_number: data.tower_number,
                    flat_number: data.flat_number,
                    status: data.status,
                    project_type: data.project_type,
                    villa_number: data.villa_number,
                    plot_number: data.plot_number,
                    pid: data.pid,
                    client_name: data.client_name,
                    client_phone: data.client_phone,
                    sales_person: data.sales_person,
                    amount_received: data.amount_received
                }, {
                    transaction: t
                }).catch(err => {
                    console.log(err);
                    throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
                })

                //Delete from the receipts table
                await global.DATA.MODELS.receipts.destroy({
                    where: {
                        project_id: payload.project_id
                    },
                    transaction: t
                }).catch(err => {
                    throw createError.InternalServerError(SQL_ERROR);
                })

            })

            return "REJECTED RECEIPT SUCCESSFULLY"

        } catch (err) {
            throw err;
        }
    }

    async getReceipts() {
        try {
            const ReceiptsData = await global.DATA.MODELS.receipts.findAll()
                .catch(err => {
                    console.log("error while getting receipts:", err.message);
                    throw createError.InternalServerError(SQL_ERROR);
                })

            return ReceiptsData;

        } catch (err) {
            throw err;
        }
    }

    async getApprovedReceiptsList() {
        try {
            const ReceiptsData = await global.DATA.MODELS.approvedreceipts.findAll()
                .catch(err => {
                    console.log("error while getting receipts:", err.message);
                    throw createError.InternalServerError(SQL_ERROR);
                })

            return ReceiptsData;

        } catch (err) {
            throw err;
        }
    }

    async getRejectedReceiptsList() {
        try {
            const ReceiptsData = await global.DATA.MODELS.rejectedreceipts.findAll()
                .catch(err => {
                    console.log("error while getting receipts:", err.message);
                    throw createError.InternalServerError(SQL_ERROR);
                })

            return ReceiptsData;

        } catch (err) {
            throw err;
        }
    }

    async getAvailableReceiptProjectNames() {
        try {
            const response = await global.DATA.CONNECTION.mysql.query(`SELECT project_name
            FROM projects
            WHERE project_id NOT IN (SELECT project_id FROM receipts);`, {
                type: Sequelize.QueryTypes.SELECT
            }).catch(err => {
                console.log("Error while fetching data", err.message);
                throw createError.InternalServerError(SQL_ERROR);
            })

            const data = (response);
            let uniqueProjectNames = new Set();

            // Filter the data array to get only unique project_name values
            let uniqueProjectNameData = data.filter(item => {
                if (!uniqueProjectNames.has(item.project_name.split('').join(''))) {
                    uniqueProjectNames.add(item.project_name.split('').join(''));
                    return true;
                }
                return false;
            });

            console.log(uniqueProjectNameData);
            return uniqueProjectNameData;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = ReceiptServices;