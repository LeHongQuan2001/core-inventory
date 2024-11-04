const moduleName = 'inventory';
const bookingPrRoute = require('./bookingPrRoute');

module.exports = function (app) {
    app.get(`/${moduleName}/about`, (req, res) => {
        return res.json({
            status: 1,
            code: 200,
            message: 'INVENTORY TRADING API',
        })
    });

    bookingPrRoute(app)
}
