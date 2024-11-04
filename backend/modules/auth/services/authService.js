const userService = require('../../core/services/userService');
const models = require('../../../configs/models');
const jwtHelper = require('../../core/helpers/jwtHelper');
const roleService = require("../../core/services/roleService");
const moment = require("moment");
const configs = require("../../../configs/configs");

const authService = {
    getAccessToken: async (data, deviceInfo = null) => {
        try {
            let user = await userService.getById(data.id);
            if (!user) {
                user = await models.User.build({
                    email: data.email,
                    fullName: data.fullName ?? '',
                    avatar: data.avatar ?? '',
                    password: '',
                    roleId: roleService.REGISTER_USER,
                    status: 1,
                    lastLogin: moment().format('YYYY-MM-DD HH:mm:ss'),
                });

                try {
                    await user.save();
                } catch (error) {
                    throw new Error(error);
                }
            } else {
                await user.update({
                    avatar: data.avatar ?? user.avatar,
                    lastLogin: moment().format('YYYY-MM-DD HH:mm:ss')
                }, {
                    silent: true // do not update updatedAt field
                });
                await models.User.deleteCache(userService.cachePrefix + user.email);
                await models.User.deleteCache(userService.cachePrefix + user.id);
            }

            if (user.status !== userService.STATUS_ACTIVE) {
                return false;
            }
            const role = await roleService.getById(user.roleId);
            if (!role || role.status !== roleService.STATUS_ACTIVE) {
                return false;
            }
            if (data.originalUser) {
                user.originalUser = data.originalUser;
            }
            const accessTokenData = await jwtHelper.signAccessToken(user, deviceInfo);
            const refreshToken = await jwtHelper.signRefreshToken(user);
            return {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                username: user.username,
                roleName: role.name,
                roleId: user.roleId ? parseInt(user.roleId) : null,
                accessToken: accessTokenData,
                refreshToken,
                createdTime: (new Date()).getTime(),
                expiresIn: parseInt(configs.jwt.ttl),
                deviceId: accessTokenData.deviceId
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}

module.exports = authService
