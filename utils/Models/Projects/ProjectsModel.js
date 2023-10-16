const Sequelize = require('sequelize')

const ProjectsModel = global.DATA.CONNECTION.mysql.define("projects", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    project_name: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: false
    },
    project_id: {
        type: Sequelize.DataTypes.BIGINT,
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
        type: Sequelize.DataTypes.STRING(1),
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
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: "projects"
})

module.exports = ProjectsModel