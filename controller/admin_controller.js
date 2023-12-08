const express = require('express');
const AdminService = require('../services/admin_service');
const Constants = require('../utils/Constants/response_messages')
const JwtHelper = require('../utils/Helpers/jwt_helper')
const jwtHelperObj = new JwtHelper();
const router = express.Router()

router.get('/getUsersList', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const adminServiceObj = new AdminService();
        const data = await adminServiceObj.getUsersList();

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

router.post('/validateUser', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const adminServiceObj = new AdminService()
        await adminServiceObj.validateUser(req.body)
        res.send({
            "status": 200,
            "message": Constants.SUCCESS,

        })
    }
    catch (err) {
        next(err);
    }
})

router.get('/approvedUsersList', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const adminServiceObj = new AdminService()
        const data = await adminServiceObj.approvedUsersList(req.body)
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

router.get('/rejectedUsersList', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const adminServiceObj = new AdminService()
        const data = await adminServiceObj.rejectedUsersList(req.body)
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