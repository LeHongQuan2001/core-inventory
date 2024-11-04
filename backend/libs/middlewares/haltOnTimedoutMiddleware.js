const response = require("../core/response");
module.exports = (req, res, next) => {
    if (req.timedout) {
        console.log(req.timedout)
        return response.jsonEncrypt(req, res, {
            status: 0,
            code: 408,
            message: `Request Timeout`
        });
    }

    next();
}
