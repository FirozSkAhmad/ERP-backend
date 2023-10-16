const createError = require('http-errors')
const { SQL_ERROR, PROJECT_CREATION_ERROR } = require('../utils/Constants/response_messages')
const { Sequelize } = require('sequelize')
const ProjectsModel = require('../utils/Models/Projects/ProjectsModel');

class ProjectsService{
    constructor(){

    }

    async createNewProject(payload) {
        try {
            // Check in Projects table whether project Id is present or not
            const data = await ProjectsModel.findOne({
                where: {
                    project_id : payload.project_id
                }
            }).catch(err => {
                console.log("Error during checking user", err.message)
                throw createError.InternalServerError(SQL_ERROR)
            })

            if (!data) {
                // Project not found, create a new one
                const newlyCreatedProject = await ProjectsModel.create(payload).catch(err => {
                    console.log("Error while adding in projects table", err.message);
                    throw createError.InternalServerError(SQL_ERROR);
                });

                return newlyCreatedProject;
            }
            //Project Already Present
            throw createError.InternalServerError(PROJECT_CREATION_ERROR);

        } catch (err) {
            throw err;
        }
    }

    async getProjects() {
        try {
            const response = await ProjectsModel.findAll().catch(err => {
                console.log("Error while fetching data", err.message);
                throw createError.InternalServerError(SQL_ERROR);
            })

            const data = (response);
            console.log("View All Projects", data);
            return data;
        }
        catch (err) {
            throw err;
        }
    }

    async getProjectIds() {
        try {
            const getAllProjectIds = await DATA.CONNECTION.mysql.query(`select project_id from projects`, {
                type: Sequelize.QueryTypes.SELECT
            }).catch(err => {
                console.log("Error while fetching data", err.message);
                throw createError.InternalServerError(SQL_ERROR);
            })

            const data = (getAllProjectIds);
            console.log("View All Projects", data);
            return data;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = ProjectsService;