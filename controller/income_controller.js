const express = require('express')
const Constants = require('../utils/Constants/response_messages');
const IncomeService = require('../services/income_service');
const router = express.Router()
const JwtHelper = require('../utils/Helpers/jwt_helper')
const jwtHelperObj = new JwtHelper();


router.get('/getIncome',jwtHelperObj.verifyAccessToken, async (req,res,next)=>{
    try{
        const incomeServiceObj = new IncomeService()
        const data = await incomeServiceObj.getIncome()
            .catch(err => {
                console.log("Error occured", err.message);
                throw err;
            })

        res.send({
            "status": 200,
            "message": Constants.SUCCESS,
            "data": data
        })
    }
    catch(err){
        next(err);
    }
})

module.exports = router