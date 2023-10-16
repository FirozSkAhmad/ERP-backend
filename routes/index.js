const ProjectController = require('../controller/projects_controller')

class IndexRoute {
    constructor(expressApp) {
        this.app = expressApp
    }

    async initialize() {
        this.app.use('/project', ProjectController)
    }
}

module.exports = IndexRoute;