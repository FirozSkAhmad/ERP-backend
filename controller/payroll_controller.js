const express = require('express')
const JwtHelper = require('../utils/Helpers/jwt_helper')
const PayrollService = require('../services/payroll_service');
const router = express.Router();
const Constants = require('../utils/Constants/response_messages')
const jwtHelperObj = new JwtHelper();

// Add new Payroll
router.post('/addPayRollDetails', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const payRollServiceObj = new PayrollService();
        const data = await payRollServiceObj.addNewPayRollDetails(req.body);

        res.send({
            "status": 201,
            "message": Constants.SUCCESS,
            "data": data
        })
    }
    catch (err) {
        next(err);
    }
})

// Edit payroll details
router.post('/editPayRollDetails', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const payRollServiceObj = new PayrollService();
        const { name, amount, role_type } = { ...req.body }
        const updatePayload = { name, amount, role_type }
        const data = await payRollServiceObj.editPayRollDetails(req.body.id, updatePayload);
        res.send({
            "status": 200,
            "message": Constants.SUCCESS
        })
    }
    catch (err) {
        next(err);
    }
})

// Get All Payroll details
router.get('/getPayRollDetails', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const payRollServiceObj = new PayrollService();
        const data = await payRollServiceObj.getPayRollDetails();
        res.send({
            "status": 200,
            "message": Constants.SUCCESS,
            "data": data
        })

    }
    catch (err) {
        next(err);
    }
})

router.get('/getExpenses',jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const payRollServiceObj = new PayrollService();
        const data = await payRollServiceObj.getExpenses();
        res.send({
            "status": 200,
            "message": Constants.SUCCESS,
            "data": data
        })

    }
    catch (err) {
        next(err);
    }
})
module.exports = router;