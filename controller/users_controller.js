const express = require('express')

const UserService = require('../services/users_service')

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

module.exports = router;