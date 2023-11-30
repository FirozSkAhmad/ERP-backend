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
    },
    project_type: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    },
    tower_number: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: true
    },
    flat_number: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: true
    },
    villa_number: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    },
    plot_number: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: "payroll"
})

module.exports = PayrollModel;