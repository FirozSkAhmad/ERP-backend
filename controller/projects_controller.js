const express = require('express')
const ProductsService = require('../services/projects_service');
// const JwtHelper = require('../utils/Helpers/jwt_helper')
const Constants = require('../utils/Constants/response_messages')

const router = express.Router()
// const jwtHelperObj = new JwtHelper();

router.post('/createNewProject', async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService();
        const data = await projectsServiceObj.createNewProject(req.body)
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

router.get('/getProjects', async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService()
        const data = await projectsServiceObj.getProjects()
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
    catch (err) {
        next(err);
    }
})

router.get('/getProjectIds', async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService()
        const data = await projectsServiceObj.getProjectIds()
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
    catch (err) {
        next(err);
    }
})

module.exports = router;