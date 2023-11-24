const express = require('express')
const router = express.Router()
const Constants = require('../utils/Constants/response_messages')
const JwtHelper = require('../utils/Helpers/jwt_helper')
const BulkUploadService = require('../services/bulkupload_service')
const multer = require('multer');
const path = require('path');
let g = ""

router.post("/bulkUpload", async(req,res,next)=>{
    try{
        let storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, process.env.FILE_UPLOAD_PATH)
            },
            filename: function (req, file, callback) {
                console.log(file)
                callback(null, file.originalname)
                g = file.originalname;
                console.log("File name",g);
            }
        })
       
        const uploadAsync = () => {
            return new Promise((resolve, reject) => {
                let upload = multer({
                    storage: storage,
                    fileFilter: function (req, file, callback) {
                        let ext = path.extname(file.originalname);
                        console.log(req.body);
                        if (ext !== '.csv' && ext !== '.xlsx') {
                            return callback(res.end('Only Excel files or Csv are allowed'), null);
                        }
                        callback(null, true);
                    },
                }).single('file');

                upload(req, res, function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };

        await uploadAsync(); 

        const bulkUploadServiceObj = new BulkUploadService();
        const {successResults, failureResults} = await bulkUploadServiceObj.uploadBulkData(process.env.FILE_UPLOAD_PATH.concat(g));
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