const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const IndexRoute = require('./routes');
const IndexModel = require('./utils/Models')
const PluginsLoader = require('./utils/Plugins')

class App {
    constructor() {
        this.app = express();
    }

    async StarterFunction() {
        // Load PLUGINS
        await new PluginsLoader().loadPlugins()
        console.log("PLUGINS loaded")

        // Load MySQL Models
        await new IndexModel().loadModels()
        console.log("MODELS loaded")

        this.app.use(cors({
            origin: '*'
        }))
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        //default route
        this.app.get("/welcome", async (req, res, next) => {
            res.send({
                "status": 200,
                "message": "Hi Started Successfully"
            })
        })

        // Use Routes after connection
        await new IndexRoute(this.app).initialize()

        // Handling Undefined route
        this.app.use(async (req, res, next) => {
            next(DATA.PLUGINS.httperrors.NotFound("URL not found. Please enter valid URL"))
        })

        // Error Handler
        this.app.use((err, req, res, next) => {
            res.status(err.status || 500)
            res.send({
                "status": err.status || 500,
                "message": err.message
            })
        })
    }

    async listen() {
        this.app.listen(4200, (err) => {
            if (err) {
                console.log("Error while running the express application", err);
            }
            else {
                console.log("Express application running on port 4200");
            }
        })
    }
}

module.exports = App;