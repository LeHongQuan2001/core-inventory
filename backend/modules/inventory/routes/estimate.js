const authMiddleware = require("../../core/middlewares/authMiddleware");
const ruleCheckerMiddleware = require("../../core/middlewares/ruleCheckerMiddleware");
const decryptRequestMiddleware = require("../../core/middlewares/decryptRequestMiddleware");
const {param, body, query} = require("express-validator");
const logMiddleware = require("../../core/middlewares/logMiddleware");

module.exports = function (app) {
    app.post(`/estimate/booking/inventory`,
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {

        });

    app.post(`/estimate/bid-price`,
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {

        });

}
