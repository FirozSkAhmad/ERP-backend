const Sequelize = require('sequelize')

const PayrollModel = global.DATA.CONNECTION.mysql.define("payroll", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    role_type: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    amount: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
    payroll_type:{
        type: Sequelize.STRING(100),
        allowNull: false
    },
    project_id:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
}, {
    tableName: "payroll"
})

module.exports = PayrollModel;