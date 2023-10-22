const Sequelize = require('sequelize');

const IncomeModel =  global.DATA.CONNECTION.mysql.define("income",{
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    project_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    status: {
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
    }
},{
    tableName: "income"
})

module.exports = IncomeModel;