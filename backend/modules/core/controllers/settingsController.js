const {validationResult} = require("express-validator");
const settingsService = require('../services/settingsService');
const response = require("../../../libs/core/response");
module.exports = {
    get: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                code: 400,
                errors: errors.array()
            })
        }

        const user = req.user;
        const routes = await settingsService.getByUser(user.id);

        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            decrypt: false,
            data: {
                routes: routes,
                user: {
                    roleId: user.roleId,
                    roleName: user.roleName
                }
            }
        });
    }
}
