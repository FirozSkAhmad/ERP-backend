const fs = require('fs');
const path = require('path');

class MySqlModels {
    constructor() {

    }

    async loadModels() {
        try {
            const modelDirectories = await fs.promises.readdir(__dirname);

            await Promise.all(modelDirectories.map(async directory => {
                const directoryPath = path.join(__dirname, directory);
                const stat = await fs.promises.stat(directoryPath);

                if (stat.isDirectory()) {
                    const files = await fs.promises.readdir(directoryPath);

                    files.forEach(file => {
                        const modelPath = path.join(directoryPath, file);
                        const model = require(modelPath);
                        // console.log('model data:',model)
                        global.DATA.MODELS[model.name] = model;
                    });
                }
            }));
        } catch (err) {
            console.error('Error loading models:', err);
        }
    }

}

module.exports = MySqlModels;