const csv = require('fast-csv')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile);
const ProjectService = require('../services/projects_service')
const fsPromises = require('fs').promises

class BulkUpload{
    constructor(){

    }

    async processCsvFile(filePath) {
        try {
            const fileContent = await readFile(filePath, 'utf8');
            return new Promise((resolve, reject) => {
                const csvData = [];
                const fileStream = csv.parse()
                    .on('data', function (data) {
                    csvData.push(data);
                    })
                    .on('end', function () {
                        // Remove header
                        csvData.shift();
                        console.log(csvData);
                        resolve(csvData);
                    })
                    .on('error', function (error) {
                        reject(error);
                    });
                const readableStream = fs.createReadStream(filePath, 'utf8');
                readableStream.pipe(fileStream);
            });
        } catch (error) {
            console.error('Error reading the file:', error);
            throw error;
        }
    }

    async uploadBulkData(filePath) {
        try {
            const projectServiceObj = new ProjectService();
            const csvData = await this.processCsvFile(filePath);
    
            // Process the parsed CSV data
            const projectsJson = csvData.map(project => ({
                "project_name": project[0],
                "status": project[1],
                "project_type": project[2], // Apartment, Villa, Plot
                "tower_number": project[3],
                "flat_number": project[4],
                "villa_number": project[5],
                "plot_number": project[6]
            }));
    
            // Insert projects into MySQL
            const promises = projectsJson.map(async (project) => {
                try {
                    const result = await projectServiceObj.createNewProject(project);
                    return { project, result };
                } catch (error) {
                    return { project, error: error.message };
                }
            });
    
            const results = await Promise.all(promises);
    
            const successResults = results.filter(result => !result.error);
            const failureResults = results.filter(result => result.error);
    
            console.log('Successful insertions:', successResults);
            console.log('Failed insertions:', failureResults);
            
            // Delete the file after processing
            await fsPromises.unlink(filePath);
            console.log('File deleted successfully:', filePath);

            return { successResults, failureResults };
        } catch (error) {
            console.error('Error processing CSV file:', error);
            throw error; 
        }
    }
    
}

module.exports = BulkUpload;