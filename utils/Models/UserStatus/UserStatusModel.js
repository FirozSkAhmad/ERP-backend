const Sequelize = require('sequelize')

const UserStatusModel = global.DATA.CONNECTION.mysql.define("userstatus", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    },
    password: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    emailId: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
    },
    role_type: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
    },
    user_type: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
    },
    status: {
        type: Sequelize.STRING(10),
        allowNull: false
    }
}, {
    tableName: "userstatus"
});

module.exports = UserStatusModel;