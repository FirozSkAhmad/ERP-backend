const Sequelize = require('sequelize')

const RejectedUsersModel = global.DATA.CONNECTION.mysql.define("rejectedusers", {
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
    }
}, {
    tableName: "rejectedusers"
});

module.exports = RejectedUsersModel;