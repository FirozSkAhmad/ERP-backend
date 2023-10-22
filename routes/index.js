const ProjectController = require('../controller/projects_controller')
const UserController = require('../controller/users_controller')
const AdminController = require('../controller/admin_controller')
const PayrollController = require('../controller/payroll_controller')

class IndexRoute {
    constructor(expressApp) {
        this.app = expressApp
    }

    async initialize() {
        this.app.use('/project', ProjectController)
        this.app.use('/auth', UserController)
        this.app.use('/admin', AdminController)
        this.app.use('/payroll', PayrollController);
    }
}

module.exports = IndexRoute;