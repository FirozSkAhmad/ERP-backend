const JwtHelper = require('../utils/Helpers/jwt_helper')
const express = require('express')
const jwtHelperObj = new JwtHelper();
const router = express.Router()
const CommissionService = require('../services/commissions_service')
const Constants = require('../utils/Constants/response_messages')

router.post("/validateCommission", jwtHelperObj.verifyAccessToken, async (req,res,next)=>{
    try{
        const commissionServiceObj = new CommissionService();
        const data = await commissionServiceObj.validateCommission(req.body).catch(err =>{
            console.log("Error occured", err.message);
            throw err;
        })

        res.send({
            "status": 200,
            "message": Constants.SUCCESS,
            "data": "COMMISSION VALIDATED SUCCESSFULLY"
        })
    }
    catch(err){
        next(err);
    }
})
router.post("/deleteComission", jwtHelperObj.verifyAccessToken, async (req,res,next)=>{
        try{
            const commissionServiceObj = new CommissionService();
            const data = await commissionServiceObj.cancelCommission(req.body).catch(err => {
                console.log("Error occured", err.message);
                throw err;
            })
    
            res.send({
                "status": 200,
                "message": Constants.SUCCESS,
                "data": "COMMISSION DELETED"
            })
        }
        catch (err) {
            next(err);
        }
})
module.exports = router;