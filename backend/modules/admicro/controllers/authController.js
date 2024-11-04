const response = require('../../../libs/core/response');
const configs = require('../../../configs/configs');
const validateRequest = require('../requests/validateRequest');
const admicroAuthService = require('../services/authService');

module.exports = {
    login: async (req, res) => {
        if(!validateRequest.validated(req, res)) {
            return;
        }
        const email = req.body.email;
        const password = req.body.password;
        const authDate = await admicroAuthService.login(email, password);

        if (authDate?.code === 403) {
            return response.jsonEncrypt(req, res, {
                status: 0,
                code: 400,
                message: authDate.message ?? 'notPermission'
            });
        }
        if (authDate === false) {
            return response.jsonEncrypt(req, res, {
                status: 0,
                code: 400,
                message: 'wrongUserNameOrPassword'
            });
        }

        return response.jsonEncrypt(req, res, {
            status: 1,
            code: 200,
            message: 'ok',
            data: {
                user: {
                    id: authDate.user.id,
                    userId: authDate.user.userId,
                    username: authDate.user.username,
                    email: authDate.user.email,
                    avatar: authDate.user.avatar,
                    roleId: authDate.user.roleId,
                    roleName: authDate.roleName,
                    fullName: authDate.user.fullName,
                    accessToken: authDate.accessToken,
                    refreshToken: authDate.refreshToken,
                    createdTime: (new Date).getTime(),
                    expiresIn: parseInt(configs.jwt.ttl),
                }
            }
        }).end();
    }
}
