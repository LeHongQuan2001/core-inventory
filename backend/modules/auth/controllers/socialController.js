const StrategyFactory = require("../factories/strategyFactory");
const authService = require("../services/authService");
const response = require("../../../libs/core/response");
const configs = require("../../../configs/configs");
const notificationService = require('../../core/services/notificationService');

module.exports = {
    request: async (req, res) => {
        const strategy = StrategyFactory.createStrategy(req.params.provider);
        return strategy.request(req, res);
    },

    callback: async (req, res) => {
        const strategy = StrategyFactory.createStrategy(req.params.provider);
        strategy.callback(req, res, async (result) => {
            let resultData = {};
            if (result.error !== false) {
                await notificationService.send(`result.error - ${JSON.stringify(req.params)} - ${JSON.stringify(result)}`);
                
                return response.jsonEncrypt(req, res,{
                    status: 0,
                    code: 400,
                    message: 'Bad Request'
                });
            }

            const email = result.data?.email;
            const extension = email ? email.split('@') : null;

            await notificationService.send(`Debug - ${JSON.stringify(req.params)} - ${JSON.stringify(result.data)}`);

            if (!email || !extension || extension.length < 1 || configs.google.email.extensions.indexOf(extension[1]) < 0) {
                return response.jsonEncrypt(req, res,{
                    status: 0,
                    code: 403,
                    message: 'Email not allowed'
                });
            }

            try {
                const headers = req.headers;
                const deviceInfo = {
                    id: headers['device-id'] || null,
                    userAgent: headers['user-agent'],
                    ip: headers['x-forwarded-for'] || req.socket.remoteAddress || null
                }
                const user = await authService.getAccessToken(result.data, deviceInfo);
                resultData = {
                    status: 1,
                    code: 200,
                    data: {
                        user
                    }
                };
            } catch (e) {
                await notificationService.send(`error - ${JSON.stringify(req.params)} - ${JSON.stringify(e)}`);
                resultData = {
                    status: 0,
                    code: 500
                };
            }
            return response.jsonEncrypt(req, res, resultData);
        });
    }
}
