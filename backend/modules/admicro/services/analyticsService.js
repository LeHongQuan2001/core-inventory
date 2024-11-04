const configs = require('../../../configs/configs')
const stringHelper = require('../../../libs/helpers/stringHelper')
const req = require('request');

const analyticsService = {
    getAccessToken: async () => {
        try {
            const serviceUrl = configs.admicro.analytics.serviceUrl;
            const path = configs.admicro.analytics.apis.getToken;
            const url = `${serviceUrl}/${path}`;
            const session = stringHelper.getRandomNumber(10);
            const options = {
                method: 'POST', url, headers: {}, formData: {
                    session_id: session,
                    app_key: configs.admicro.analytics.appKey,
                    username: configs.admicro.analytics.username,
                    password: configs.admicro.analytics.password
                }
            };
            const data = await new Promise(function (resolve, reject) {
                req(options, function (error, rs) {
                    try {
                        const result = JSON.parse(rs.body);
                        if (typeof (result.status) != "undefined" && result.status === 'RESULT_OK') {
                            resolve(result);
                        }
                        resolve(false);
                    } catch (e) {
                        resolve(false);
                    }
                });
            });
            return {
                session: session, accessToken: data?.access_token ?? null
            };
        } catch (e) {
            console.log('error', e);
        }
    }
}

module.exports = analyticsService
