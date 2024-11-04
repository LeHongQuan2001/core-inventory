const admicroAuthController = require('../controllers/authController');
const {authRequest} = require('../requests/authRequest');
const decryptRequestMiddleware = require("../../core/middlewares/decryptRequestMiddleware");
const googleRecaptchaMiddleware = require("../../core/middlewares/googleRecaptchaMiddleware");

module.exports = function(app) {
    app.post(`/admicro/auth/login`,
        [decryptRequestMiddleware, googleRecaptchaMiddleware],
        authRequest.login(),
        (req, res) => {
            return admicroAuthController.login(req, res)
        });
}
