require('dotenv').config();

global.DATA = {
    CONNECTION: {
        mysql: undefined
    },
    MODELS: {

    },
    PLUGINS: {

    }
}

const MySQLConnection = require('./connections/mysql_connection')

const InitializeConnection = async () => {
    try {
        const connectionObjMySQL = new MySQLConnection();
        await connectionObjMySQL.initialize();

    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

async function IntializeApp() {
    const App = require('./app');
    const app = new App();
    await app.StarterFunction();
    await app.listen();
}

(async function () {
    await InitializeConnection();
    await IntializeApp();
})();