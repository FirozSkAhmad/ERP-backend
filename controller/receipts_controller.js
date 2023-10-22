const express = require('express')
const Constants = require('../utils/Constants/response_messages');
const ReceiptServices = require('../services/receipts_service');

const router = express.Router()

router.post('/createReceipt', async (req,res,next)=>{
    try {
        const reciptsServiceObj = new ReceiptServices();
        const data = await reciptsServiceObj.createReceipt(req.body)
            .catch(err => {
                console.log("error", err.message);
                throw err;
            })

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

router.post('/validateReceipt', async (req,res,next)=>{
    try{
        const reciptsServiceObj = new ReceiptServices();
        const data = await reciptsServiceObj.validateReceipt(req.body)
        .catch(err=>{
            console.log("errors:",err.message);
            throw err;
        })

        res.send({
            "status": 201,
            "message": Constants.SUCCESS,
            "data": data
        })

    }catch(err){
        next(err);
    }
})

router.post('/rejectReceipt', async (req,res,next)=>{
    try{
        const reciptsServiceObj = new ReceiptServices();
        const data = await reciptsServiceObj.rejectReceipt(req.body)
        .catch(err=>{
            console.log("errors:",err.message);
            throw err;
        })

        res.send({
            "status": 201,
            "message": Constants.SUCCESS,
            "data": data
        })

    }catch(err){
        next(err);
    }
})

router.get('/getReceipts', async (req,res,next)=>{
    try{
        const reciptsServiceObj = new ReceiptServices();
        const data = await reciptsServiceObj.getReceipts()
        .catch(err=>{
            console.log("errors:",err.message);
            throw err;
        })

        res.send({
            "status": 201,
            "message": Constants.SUCCESS,
            "data": data
        })

    }catch(err){
        next(err);
    }
})

module.exports = router;