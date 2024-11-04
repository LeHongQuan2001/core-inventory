const userService = require('../services/userService');
const roleService = require('../services/roleService');
const validateRequest = require('../requests/validateRequest');
const configs = require('../../../configs/configs');
const response = require("../../../libs/core/response");
const authService = require("../../auth/services/authService");
const bcrypt = require("bcrypt");
const {md5} = require("request/lib/helpers");

module.exports = {
    index: async (req, res) => {
        const criteria = {}  
        if (req.query.role > 0) {
            criteria.roleId = parseInt(req.query.role);
        }
        if (req.query.keyword) {
            criteria.email = decodeURIComponent(req.query.keyword);
        }
        if(req.query.status){
            criteria.status = req.query.status;
        }

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const offset = page > 0 ? (page - 1) * limit : 0;

        const users = await userService.filter(criteria, offset, limit);
        const results = [];
        users.rows.forEach(element => {
            results.push({
                id: element.dataValues.id,
                fullName: element.dataValues.fullName,
                username: element.dataValues.username,
                status: element.dataValues.status,
                avatar:element.dataValues.avatar,
                allow: element.dataValues.allow,
                email: element.dataValues.email,
                roleId: element.dataValues.roleId,
                createdAt: element.dataValues.createdAt
            })
        });

        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            data: {
                users: results,
                count: users.count
            }
        });
    },
    store: async (req, res) => {
        return res.json({
            status: 1,
            code: 200,
            data: []
        });
    },
    update: async (req, res) => {
        if (!validateRequest.validated(req, res)) {
            return response.jsonEncrypt(req, res, {
                status: 0,
                message: 'Error',
                code: 400,
                data: {}
            });
        }
        const user = req.userData;
        const role = req.role;
        const dataUpdate =  {
            roleId: role !== -1 ? role.id : null,
            status: req.body.status || 0,
            ext: req.body.ext || {}
        }
        dataUpdate.ext = JSON.stringify(dataUpdate.ext);

        // create password
        const newPassword = req.body?.newPassword;
        const confirmPassword = req.body?.confirmPassword;
        if (newPassword && newPassword === confirmPassword) {
            const hashPassword = md5(newPassword + user.id.toString());
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(hashPassword, salt);
            dataUpdate.password = hash;
        } else if (!newPassword && !confirmPassword) {
            // dataUpdate.password = '';
        } else if (newPassword !== confirmPassword) {
            return response.jsonEncrypt(req, res, {
                status: 0,
                message: 'Error',
                code: 400,
                data: {}
            });
        }

        await userService.update(user, dataUpdate);

        const data = req.data || {};
        data.user = {
            id: user.id,
            username: user.username,
            status: user.status,
            allow: user.allow,
            roleId: user.roleId,
            ext: user.getExt()
        }

        return response.jsonEncrypt(req, res, {
            status: 1,
            code: 200,
            data
        });
    },
    setRole: async (req, res) => {
        const user = req.userData;
        const role = req.role;
        try {
            const dataUpdate = {
                roleId: role !== -1 ? role.id : null,
            }
            await userService.update(user, dataUpdate);
        } catch (e) {}

        const data = req.data || {};
        data.user = {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            status: user.status,
            allow: user.allow,
            roleId: user.roleId
        }

        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            data
        });
    },
    delete: async (req, res) => {
        return response.jsonEncrypt(req, res, {
            status: 1,
            code: 200,
            data: []
        });
    },
    switchUser: async (req, res) => {
        const userId = req.body.userId !== 'undefined' ? req.body.userId : null;
        const userSwitch = await userService.getById(userId);

        const userOriginal = req.user;

        if (userOriginal) {
            userSwitch.originalUser = userOriginal.id
        }

        if (!userSwitch) {
            return response.jsonEncrypt(req, res, {
                status: 0,
                code: 404,
                message: 'dataNotFound'
            }).end();
        }

        if (userSwitch.roleId && userSwitch.roleId === configs.roles.superAdmin){
           return  response.jsonEncrypt(req, res, {
                status: 0,
                code: 400,
                message: 'You do not have permission'
            }).end();
        }

        const userData = await authService.getAccessToken(userSwitch, null);
        return response.jsonEncrypt(req, res, {
            status: 1,
            code: 200,
            data: {
                user: userData
            }
        }).end();
    }
}
