const configs = require('../../../configs/configs')
const jwt = require("jsonwebtoken");
const jwtHelper = require('../helpers/jwtHelper')

module.exports = (req, res, next) => {
    jwtHelper.verifyAccessToken(req, res, next)
}
