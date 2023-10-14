async function IntializeApp(){
    const App = require('./app');
    const app = new App();
    app.listen();
}

(async function () {
    await IntializeApp()
})();