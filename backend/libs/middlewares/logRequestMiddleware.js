const stringHelper = require('../../libs/helpers/stringHelper');
const logService = require('../../modules/core/services/logService');

module.exports = (req, res, next) => {
    try {
        let errorMessage = null;
        req.on("error", error => {
            errorMessage = error.message;
        });

        res.on("finish", () => {
            const route = req.route;
            const params = req.params;
            const body = req.body;
            const {rawHeaders, httpVersion, method, socket, originalUrl} = req;
            const {remoteAddress, remoteFamily} = socket;

            if (params && typeof params.clientPubKey !== 'undefined') {
                delete params.clientPubKey;
            }
            if (body && typeof body.clientPubKey !== 'undefined') {
                delete body.clientPubKey;
            }

            const options = null;
            const {statusCode, statusMessage, code} = res;
            const headers = res.getHeaders();
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            const module = null;
            const controller = null;
            const action = null;
            const result = logService.create({
                url: originalUrl,
                path: route.path,
                params: JSON.stringify(params),
                ip: ip ? stringHelper.ip2int(ip) : 0,
                userId: req.user.id,
                method,
                //methodCrc: stringHelper.toNumber(method),
                module,
                //moduleCrc: stringHelper.toNumber(module),
                controller,
                //controllerCrc: stringHelper.toNumber(controller),
                action,
                //actionCrc: stringHelper.toNumber(action),
                dataRequest: JSON.stringify(body),
                dataResponse: JSON.stringify({}),
            }).then((e) => {});
        });
    } catch (e) {
        console.log(e)
    }
    next();
};

