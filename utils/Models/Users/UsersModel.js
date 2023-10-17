const Sequelize = require('sequelize')

const UsersModel = global.DATA.CONNECTION.mysql.define("users", {
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
    tableName: "users"
});

module.exports = UsersModel;