const express = require('express')
const ProductsService = require('../services/projects_service');
const Constants = require('../utils/Constants/response_messages')

const router = express.Router()
const JwtHelper = require('../utils/Helpers/jwt_helper')
const jwtHelperObj = new JwtHelper();

router.post('/createNewProject',jwtHelperObj.verifyAccessToken, async (req, res, next) => {
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

router.get('/getProjectNames',jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService()
        const data = await projectsServiceObj.getProjectNames()
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

router.get('/getAvailableProjectNames',jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService()
        const data = await projectsServiceObj.getAvailableProjectNames()
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

router.get('/getFilteredProjectTypes/:projectName', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService();
        const payload = {
            "project_name": req.params.projectName
        }
        const data = await projectsServiceObj.getFilteredProjectTypes(payload)
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

router.get('/getFilteredProjectTowerNumbers/:projectName/:projectType', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService();
        const payload = {
            "project_name": req.params.projectName,
            "project_type": req.params.projectType
        }
        const data = await projectsServiceObj.getFilteredProjectTowerNumbers(payload)
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

router.get('/getFilteredProjectFlatNumbers/:projectName/:projectType/:projectTowerNumber', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService();
        const payload = {
            "project_name": req.params.projectName,
            "project_type": req.params.projectType,
            "tower_number": req.params.projectTowerNumber
        }
        const data = await projectsServiceObj.getFilteredProjectFlatNumbers(payload)
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

router.get('/getFilteredProjectVillaNumbers/:projectName/:projectType', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService();
        const payload = {
            "project_name": req.params.projectName,
            "project_type": req.params.projectType
        }
        const data = await projectsServiceObj.getFilteredProjectVillaNumbers(payload)
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

router.get('/getFilteredProjectPlotNumbers/:projectName/:projectType', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService();
        const payload = {
            "project_name": req.params.projectName,
            "project_type": req.params.projectType
        }
        const data = await projectsServiceObj.getFilteredProjectPlotNumbers(payload)
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

router.get('/getFilteredProjectStatus', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService();
        const payload = {
            "project_name": req.query.project_name,
            "project_type": req.query.project_type,
            "tower_number": req.query.tower_number,
            "flat_number":  req.query.flat_number,
            "villa_number": req.query.villa_number,
            "plot_number":  req.query.plot_number,
        }
        const data = await projectsServiceObj.getFilteredProjectStatus(payload)
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

router.post('/editProject', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService()
        const data = await projectsServiceObj.editProject(req.body)
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

router.post('/changeProjectStatus', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
    try {
        const projectsServiceObj = new ProductsService()
        const data = await projectsServiceObj.changeProjectStatus(req.body)
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

router.get('/getProjects', jwtHelperObj.verifyAccessToken, async (req, res, next) => {
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

module.exports = router;