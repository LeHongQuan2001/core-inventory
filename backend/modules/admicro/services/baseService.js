const configs = require('../../../configs/configs')
const jwtHelper = require('../../core/helpers/jwtHelper')
const moment = require('moment');
const notificationService = require("../../core/services/notificationService");

const baseService = {
    genToken: async () => {
        return await jwtHelper.signWithPayload({
            domain: configs.admicro.sso.domain,
            ctt: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
        }, configs.admicro.sso.key);
    },
    encodeJWTData: async (data) => {
        let payload = data;
        payload.domain = configs.admicro.sso.domain;
        payload.ctt = moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss');

        return await jwtHelper.signWithPayload(payload, configs.admicro.sso.key);
    },
    notifyError: (url, method, message) => {
        const msg = `[${configs.app.env}][${configs.app.name}] - Có lỗi xảy ra lúc : ${moment().format('HH:mm:ss DD/MM/YYYY')}\n` +
            ` - Lỗi: \n` +
            ` - URL: ${url}\n` +
            ` - METHOD: ${method}\n` +
            ` - Message: ${message}`;
        notificationService.send(msg);
    },
    notifyCallAPIError: (url, method, message) => {
        const msg = `- Call API Fail at: ${moment().format('HH:mm:ss DD/MM/YYYY')} \n` +
            ` - URL: ${url} \n` +
            ` - Method: ${method} \n` +
            ` - Message: ${message}`;
        notificationService.send(msg);
    }
}

module.exports = baseService
