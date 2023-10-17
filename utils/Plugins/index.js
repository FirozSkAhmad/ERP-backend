class LoadPlugins {
    constructor() {

    }
    async loadPlugins() {
        try {
            global.DATA.PLUGINS["bcrypt"] = require('bcrypt')
            global.DATA.PLUGINS["httperrors"] = require('http-errors')
            global.DATA.PLUGINS["jsonwebtoken"] = require("jsonwebtoken")
        }
        catch (err) {
            console.log("Error while loading the PLGINS");;
            throw err;
        }
    }
}
module.exports = LoadPlugins;