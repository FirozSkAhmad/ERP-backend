const Sequelize = require('sequelize')
class MySQLConnection {
    constructor() {

    }
    async initialize() {
        await this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            let sequelizeProps = {
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                dialect: 'mysql',
                logging: false,
                define: {
                    timestamps: true
                }
            };
            const sequelize = new Sequelize(
                process.env.MYSQL_DATABASE,
                process.env.MYSQL_USERNAME,
                process.env.MYSQL_PASSWORD,
                sequelizeProps
            );
            global.DATA.CONNECTION.mysql = sequelize;
            await sequelize.authenticate()
            console.log(`Connected to My SQL Database Sucessfully - ${process.env.MYSQL_DATABASE}`);

        } catch (error) {
            console.error('Unable to connect to the mysql database:', error.message);
        }
    }
}

module.exports = MySQLConnection;