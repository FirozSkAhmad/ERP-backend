const createHttpError = require("http-errors");
const { Sequelize } = require("sequelize");
const { SQL_ERROR } = require("../utils/Constants/response_messages");

class IncomeService{
    constructor(){

    }

    async getIncome(){
        try{
             const IncomeData = await global.DATA.CONNECTION.mysql.query(`select sum(amount_received) as total_income from income`,{
                type: Sequelize.QueryTypes.SELECT
             }).catch(err=>{
                console.log("error getting total income:",err.message);
                throw createHttpError.InternalServerError(SQL_ERROR);
             })

             return IncomeData[0].total_income

        }catch(err){
            throw err;
        }
    }
}

module.exports = IncomeService;