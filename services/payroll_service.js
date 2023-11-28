const { Sequelize } = require('sequelize');
const Constants = require('../utils/Constants/response_messages');
const createHttpError = require('http-errors');

class PayrollService {
    constructor() {

    }

    async addNewPayRollDetails(payrollDetails) {
        try {
            const data = await global.DATA.MODELS.payroll.create({
                ...payrollDetails,
                payroll_type:"SALARY"
            })
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
            const data = await global.DATA.MODELS.payroll.findAll().catch(err => {
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

    async getExpenses(){
        try{
            const expenseData = await global.DATA.CONNECTION.mysql.query(`select SUM(amount) as total_expense from payroll`,{
                type : Sequelize.QueryTypes.SELECT
            }).catch(err=>{
                console.log("error in getting expenses:",err.message);
                throw createHttpError.InternalServerError(Constants.SQL_ERROR);
            })
            return expenseData[0].total_expense
        }catch(err){
            throw err;
        }
    }

    async getRoleNames(){
        try{
            const data = await global.DATA.MODELS.roletypesmodel.findAll().catch(err => {
                console.log("Error while fetching payroll data", err);
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR);
            });
            return data;
        }
        catch(err){
            throw err;
        }
    }

    async addPayrollRole(role_name){
        try{
            const data = await global.DATA.MODELS.roletypesmodel.create({
                role_name:role_name
            }).catch(err => {
                    console.log("Error while saving payroll role name details", err);
                    throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR);
                })
            return data;
        }
        catch(err){
            throw err;
        }
    }

    async deletePayrollRole(id){
        try{
            const data = await global.DATA.MODELS.roletypesmodel.destroy({
                where:{
                    id:id
                }
            }).catch(err => {
                    console.log("Error while deleting payroll role name details", err);
                    throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR);
                })
            return data;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = PayrollService;