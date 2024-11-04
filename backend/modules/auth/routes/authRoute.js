const socialController = require('../controllers/socialController');
const featureSocialLoginMiddleware = require('../middlewares/featureFlags/socialLoginMiddleware');
const decryptRequestMiddleware = require("../../core/middlewares/decryptRequestMiddleware");

module.exports = (app) => {
    app.get('/auth/:provider/request', (req, res) => {
            return socialController.request(req, res);
        });

    // callback route
    app.get('/auth/:provider/callback', [decryptRequestMiddleware], (req, res) => {
            return socialController.callback(req, res);
        });
}
