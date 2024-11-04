const authMiddleware = require("../../core/middlewares/authMiddleware");
const ruleCheckerMiddleware = require("../../core/middlewares/ruleCheckerMiddleware");
const decryptRequestMiddleware = require("../../core/middlewares/decryptRequestMiddleware");
const {param, body, query} = require("express-validator");
const logMiddleware = require("../../core/middlewares/logMiddleware");

module.exports = function (app) {
    app.get(`/location/booking/list`,
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {

        });

    app.post(`/admin/location/booking/create`,
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, logMiddleware],
        (req, res) => {

        });

    app.put(`/admin/location/booking/update`,
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, logMiddleware],
        (req, res) => {

        });

    app.delete(`/admin/location/booking/delete`,
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, logMiddleware],
        (req, res) => {

        });

}
