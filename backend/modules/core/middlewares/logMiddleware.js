const logService = require('../services/logService');
const configs = require('../../../configs/configs');
const stringHelper = require('../../../libs/helpers/stringHelper')
const {get} = require('lodash');

module.exports = async (req, res, next) => {
    if (!configs.logRequest.enabled) return next()
    setLogAction(req);
    next();
}

const setLogAction = async function (req) {
    try {
        const user = req.user;
        const mainPath = get(req, 'route.path') ?? get(req, 'url', '');
        let module = mainPath ? mainPath.split('/')[2] : '';
        module = module.replace(/[-_]/g, ' ');
        const body = get(req, 'body', {});
        if (body?.clientPubKey) {
            delete body.clientPubKey;
        }
        const pathParsed = get(req, '_parsedUrl.pathname')
        const queryData = get(req, 'query', {});
        const userAgent = req.headers['user-agent'];
        const params = get(req, 'params', {});
        const method = get(req, 'method');
        const url = get(req, 'protocol') + '://' + get(req, 'host') + get(req, 'originalUrl');
        const originalUser = user.originalUser ?? null;
        const info = {
            userId: get(user, 'id'),
            ip: req.header('X-Client-RIP') ? req.header('X-Client-RIP') : (req.header('x-forwarded-for') ?? req.socket.remoteAddress),
            path: pathParsed,
            params: JSON.stringify(queryData),
            device: userAgent.includes('Mobile') === true ? 'mobile' : 'desktop',
            module,
            dataRequest: JSON.stringify(stringHelper.clearNullValue(body)),
            method,
            action: method,
            url,
            originalUser
        }

        if (method === 'PUT' && Object.keys(params).length > 0) {
            const result = await logService.getHistory({
                id: user.id, method, module, path: pathParsed
            });
            if (result) {
                info.oldDataRequest = result.dataRequest;
            }
        }
        logService.create(info);
    } catch (e) {
        console.log("error", error)
    }
}
