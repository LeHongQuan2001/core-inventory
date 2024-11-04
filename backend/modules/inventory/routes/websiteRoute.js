const authMiddleware = require("../../core/middlewares/authMiddleware");
const ruleCheckerMiddleware = require("../../core/middlewares/ruleCheckerMiddleware");
const decryptRequestMiddleware = require("../../core/middlewares/decryptRequestMiddleware");
const {param, body, query} = require("express-validator");
const logMiddleware = require("../../core/middlewares/logMiddleware");

module.exports = function (app) {
    app.get(`/admin/website/list`,
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {

        });

    app.post(`/admin/website/create`,
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, logMiddleware],
        (req, res) => {

        });

    app.put(`/admin/website/update`,
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, logMiddleware],
        (req, res) => {

        });

}
