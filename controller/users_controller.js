const express = require('express')
const UserService = require('../services/users_service')
const JwtHelper = require('../utils/Helpers/jwt_helper')
const jwtHelperObj = new JwtHelper();
const router = express.Router()
const Constants = require('../utils/Constants/response_messages')

router.post('/register', async (req, res, next) => {
    try {
        const userSeviceObj = new UserService();
        const data = await userSeviceObj.createUser(req.body);
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

router.post('/login', async (req, res, next) => {
    try {
        const userSeviceObj = new UserService();
        const data = await userSeviceObj.loginUser(req.body);
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

router.post("/resetPasswordSendRequest", async (req,res,next)=>{
    try{
        const userServiceObj = new UserService();
        const data = await userServiceObj.sendPasswordResetRequest(req.body.emailId);
        res.send({
            "status": 200,
            "message": data,
            "data": data
        })
    }   
    catch(err){
        next(err);
    }
})

router.post("/changePassword", async(req,res,next)=>{
    try{
        const userServiceObj = new UserService();
        const data = await userServiceObj.changePassword(req.body.token,req.body.password);
        res.send({
            "status": 200,
            "message": data,
            "data": data
        })
    }
    catch(err){
        next(err);
    }
})

module.exports = router;