const configs = require('../../../configs/configs')
const jwtHelper = require('../../core/helpers/jwtHelper')
const moment = require('moment');
const req = require('request');
const coreModels = require('../../core/models/index')
const notificationService = require('../../core/services/notificationService')
const userService = require('../../core/services/userService')
const analyticsService = require('./analyticsService');

const authService = {
    login: async (email, password) => {
        try {
            const serviceUrl = configs.admicro.analytics.serviceUrl;
            const path = configs.admicro.analytics.apis.login;
            const url = `${serviceUrl}/${path}`;
            const token = await analyticsService.getAccessToken();
            const options = {
                method: 'POST',
                url,
                headers: {
                    Authorization: `Bearer ${token.accessToken} SessionId ${token.session}`
                },
                formData: {
                    username: email,
                    password: password
                }
            };
            const userInfo = await new Promise(function (resolve, reject) {
                req(options, function (error, rs) {
                    try {
                        const result = JSON.parse(rs.body);
                        if (typeof (result.status) != "undefined") {
                            resolve(result.data);
                        }
                    } catch (e) {
                        resolve(false);
                    }
                });
            });
            if (userInfo && userInfo.user_id) {
                let user = await userService.getById(userInfo.user_id);
                if (user == null) {
                    user = await coreModels.User.build({
                        id: userInfo.user_id,
                        username: userInfo.username,
                        fullName: userInfo.username,
                        email: userInfo.email_address ?? null,
                        avatar: null,
                        allow: 1,
                        status: coreModels.User.STATUS_SUSPEND,
                        roleId: coreModels.Role.ROLE_USER
                    })

                    await user.save();
                    await user.reload({
                        include: [{
                            model: coreModels.Role,
                            as: 'Role',
                            attributes: ['name']
                        }]
                    });
                    const msg = `${userInfo.username} đăng ký vào hệ thống lúc: ${moment().format('HH:mm:ss DD/MM/YYYY')}\n`;
                    notificationService.send(msg);
                }

                if (user.status !== 1) {
                    return {code: 403};
                }

                if (user.status === 1) {
                    const msg = `${userInfo.username} login vào hệ thống lúc: ${moment().format('HH:mm:ss DD/MM/YYYY')}\n`;
                    notificationService.send(msg);

                    const accessToken = jwtHelper.signAccessToken(user);
                    const refreshToken = jwtHelper.signRefreshToken(user);

                    return {
                        user: user,
                        roleName: user.Role ? user.Role.name : null,
                        accessToken,
                        refreshToken
                    }
                }
            }
            return false;
        } catch (e) {
            console.log('error', e)
        }
    }
}

module.exports = authService
