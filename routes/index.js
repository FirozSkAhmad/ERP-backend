const ProjectController = require('../controller/projects_controller')
const UserController = require('../controller/users_controller')
const AdminController = require('../controller/admin_controller')
const ReceiptController = require('../controller/receipts_controller')
const IncomeController = require('../controller/income_controller')
const PayrollController = require('../controller/payroll_controller')
const CommissionController = require('../controller/commission_controller')
const BulkUploadController = require('../controller/bulkupload_controller')

class IndexRoute {
    constructor(expressApp) {
        this.app = expressApp
    }

    async initialize() {
        this.app.use('/project', ProjectController)
        this.app.use('/auth', UserController)
        this.app.use('/admin', AdminController)
        this.app.use('/receipt', ReceiptController)
        this.app.use('/income', IncomeController)
        this.app.use('/payroll', PayrollController);
        this.app.use('/commission',CommissionController)
        this.app.use("/upload", BulkUploadController);
    }
}

module.exports = IndexRoute;