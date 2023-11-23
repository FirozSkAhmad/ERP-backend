const express = require('express')
const router = express.Router()
const Constants = require('../utils/Constants/response_messages')
const JwtHelper = require('../utils/Helpers/jwt_helper')
const BulkUploadService = require('../services/bulkupload_service')
const multer = require('multer');
const path = require('path');

 // multer configuration
 let storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"/home/ec2-user/VRC_Backend/uploads")
    },
    filename:(req,file,callback)=>{
        callback(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({
    storage:storage
})


// router.get('/', async (req,res)=>{
//     const filePath = path.join(__dirname, '..', 'index.html');
//     res.sendFile(filePath);
// })


router.post("/bulkUpload", upload.single('file'), async(req,res,next)=>{
    try{
        const bulkUploadServiceObj = new BulkUploadService();
        const completeFilePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        const {successResults, failureResults} = await bulkUploadServiceObj.uploadBulkData(completeFilePath);
        res.send({
            "status": 200,
            "message": "DATA UPLOADED SUCCESSFULLY",
            "data":{
                "success":successResults,
                "failure":failureResults
            }
        })
    }
    catch(err){
        console.log("error while uploading the projects",err);
        next(err);
    }
})

module.exports = router;