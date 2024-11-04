const roleService = require('../services/roleService')
const { validationResult } = require('express-validator')
const response = require("../../../libs/core/response");

module.exports = {
    index: async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;
        const status = req.query.status ? parseInt(req.query.status) : undefined;
        const keyword = req.query.keyword ? decodeURIComponent(req.query.keyword) : null;

        const criteria = {
            keyword,
            status
        }

        const rs = await roleService.list(criteria, page, limit)
        const data = res.data || {};
        data.roles = {
            data: [],
            count: 0
        }
        if (rs && rs.rows) {
            data.roles.count = rs.count;
            for (const i in rs.rows) {
                data.roles.data.push({
                    id: rs.rows[i].id,
                    name: rs.rows[i].name,
                    status: rs.rows[i].status,
                    avatar: rs.rows[i].avatar,
                    permissionLocked: rs.rows[i].permissionLocked || 0,
                    data: rs.rows[i].getData() || {}
                })
            }
        }

        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            data: data
        });
    },
    checkNameExist: async (req, res) => {
        const name = req.query.name ? decodeURIComponent(req.query.name) : null;
        const rs = await roleService.checkNameExist(name);
        const data = res.data || {};
        data.count = rs || 0;

        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            data: data
        });
    },
    store: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                code: 400,
                errors: errors.array()
            })
        }

        const name = req.body.name.toString()
        const status = req.body.status.toString()
        const data = {
            name,
            status,
            permissionLocked: req.body.permissionLocked || 0,
        };
        const result = {
            status: 0,
            code: 400,
            message: 'fail',
            data: res.data || {}
        }
        const exists = await roleService.checkNameExist(name);
        if (exists) {
            return response.jsonEncrypt(req, res, result);
        }

        const role = await roleService.create(data);
        if (role) {
            result.status = 1;
            result.code = 200;
            result.message = 'success';
            result.data.role = {
                id: role.id,
                name: role.name,
                status: role.status,
                permissionLocked: role.permissionLocked,
            }
        }
        return response.jsonEncrypt(req, res, result);
    },
    update: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                code: 400,
                errors: errors.array()
            })
        }
        const role = req.role;
        const name = req.body.name.toString()
        const status = req.body.status.toString()
        const roleData = req.body.data || {};
        const data = {
            name,
            status,
            permissionLocked: req.body.permissionLocked || 0,
            data: JSON.stringify(roleData)
        };
        const rsFormat = {
            status: 0,
            code: 400,
            message: 'fail',
            data: res.data || {}
        }
        const rs = await roleService.update(role, data);
        if (rs) {
            rsFormat.status = 1;
            rsFormat.code = 200;
            rsFormat.message = 'success';
            rsFormat.data.role = {
                id: rs.id,
                name: rs.name,
                status: rs.status,
                permissionLocked: rs.permissionLocked || 0,
            }
        }

        return response.jsonEncrypt(req, res, {
            status: 1,
            code: 200,
            data: rs,
            message: 'success'
        });
    },
    delete: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                code: 400,
                errors: errors.array()
            })
        }
        const role = req.role;
        const rsFormat = {
            status: 0,
            code: 400,
            message: 'fail',
            data: res.data || {}
        }
        const rs = await roleService.delete(role);
        if (rs) {
            rsFormat.status = 1;
            rsFormat.code = 200;
            rsFormat.message = 'success';
        }

        return response.jsonEncrypt(req, res, {
            status: 1,
            code: 200,
            data: rs,
            message: 'success'
        });
    }
}
