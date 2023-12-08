const Sequelize = require('sequelize')

const rejectedReceiptsModel = global.DATA.CONNECTION.mysql.define("rejectedreceipts", {
    project_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    project_name: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: false
    },
    tower_number: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: true
    },
    flat_number: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: true
    },
    status: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
    },
    project_type: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
    },
    villa_number: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    },
    plot_number: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    },
    pid:{
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
    },
    client_name:{
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    },
    client_phone:{
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    },
    sales_person:{
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    },
    amount_received:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: "rejectedreceipts"
})

module.exports = rejectedReceiptsModel