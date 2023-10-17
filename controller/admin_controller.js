const express = require('express');
const AdminService = require('../services/admin_service');
const Constants = require('../utils/Constants/response_messages')

const router = express.Router()

router.get('/getUsersList', async (req, res, next) => {
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

router.post('/validateUser', async (req, res, next) => {
    try {
        const adminServiceObj = new AdminService()
        await adminServiceObj.validateUser(req.body)
        res.send({
            "status": 200,
            "message": Constants.SUCCESS
        })
    }
    catch (err) {
        next(err);
    }
})

module.exports = router;