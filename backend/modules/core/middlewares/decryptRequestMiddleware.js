const encryptService = require('../../../libs/services/encryptService');
const response = require('../../../libs/core/response');
const moment = require("moment");

module.exports = async (req, res, next) => {
    if (!encryptService.isActive) {
        return next();
    }

    try {
        const bodyEncrypt = req.body || null;
        const body = Object.keys(bodyEncrypt).length === 0 ? false : encryptService.decryptRequest(bodyEncrypt);
        const timestamp = moment().unix();

        const key = typeof req.query.k !== 'undefined' ? req.query.k : false;
        const data = typeof req.query.d !== 'undefined' ? req.query.d : false;

        if (body) {
            req.body = JSON.parse(body);
            req.clientPubKey = req.body.clientPubKey || null;

                if (typeof req.body.timestamp === 'undefined' || Math.abs(timestamp - Math.floor(req.body.timestamp / 1000)) > 60) {
                return response.jsonEncrypt(req, res,{
                    status: 0,
                    code: 400,
                    message: `Invalid Body Request`
                });
            }
            return next();
        }
        
        if (key && data) {
            const params = JSON.parse(encryptService.decryptRequest({
                k: key,
                d: data
            }));

            if (typeof params.timestamp === 'undefined' || Math.abs(timestamp - params.timestamp / 1000) > 60) {
                return response.jsonEncrypt(req, res,{
                    status: 0,
                    code: 400,
                    message: `Invalid Body Request`
                });
            }

            req.clientPubKey = params.clientPubKey || null;
            req.query = params;
            return next();
        }

        return response.jsonEncrypt(req, res, {
            status: 0,
            code: 400,
            message: `Invalid Body Request 2`
        });
    } catch (error) {
        return response.jsonEncrypt(req, res,{
            status: 0,
            code: 400,
            message: `Error decryptRequest: ` + error.message
        });
    }
}
