const createError = require('http-errors')
const { SQL_ERROR } = require('../utils/Constants/response_messages')
const { Sequelize } = require('sequelize');
const ReceiptsModel = require('../utils/Models/Receipts/ReceiptsModel');

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
            console.log('checkReceipt:', checkReceipt[0].status);
            let selectedProjectId = checkReceipt[0].project_id;
            if (checkReceipt[0].status !== 'AVAILABLE') {
                throw createError.BadRequest("Provided Project is not Available to Onboard the Client")
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

            })

            return "APPROVED RECEIPT SUCCESSFULLY"

        } catch (err) {
            throw err;
        }
    }

    async rejectReceipt(payload){
        try {

            // just remove from receipts table
            await global.DATA.CONNECTION.mysql.transaction(async (t) => {

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

    async getReceipts(){
        try{
            const ReceiptsData = await global.DATA.MODELS.receipts.findAll()
            .catch(err=>{
                console.log("error while getting receipts:",err.message);
                throw createError.InternalServerError(SQL_ERROR);
            })

            return ReceiptsData;

        }catch(err){
            throw err;
        }
    }
}

module.exports = ReceiptServices;