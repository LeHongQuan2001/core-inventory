const logService = require("../services/logService");
const userService = require("../services/userService");
const response = require("../../../libs/core/response");
const { validationResult } = require('express-validator')

module.exports = { 
    index: async (req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            const keyword = req.query.keyword ? decodeURIComponent(req.query.keyword) : null;
            const criteria = {
                keyword,
                fd: req.query.fd + ' 00:00:00',
                td: req.query.td + ' 23:59:59'
            }
            if (req.query.module) {
                criteria.module = req.query.module;
            }
            if (req.query.action) {
                criteria.action = req.query.action;
            }

            const rs = await logService.list(criteria, page, limit);
            const data = res.data || {};
            data.logs = {
                data: [],
                count: 0
            }
            if (rs?.rows) {
                data.logs.count = rs.count;
                for (const i in rs.rows) {
                    let originalUser = {};
                    if (rs.rows[i].originalUser) {
                        const user = await userService.getById(rs.rows[i].originalUser);

                        originalUser = {
                            id: user.id,
                            username: user.username,
                            fullname: user.fullName,
                            email: user.email
                        }
                    }
                    data.logs.data.push({
                        id: rs.rows[i].id,
                        user: {
                            id: rs.rows[i].User?.id ?? null,
                            username: rs.rows[i].User?.username ?? null,
                            fullname: rs.rows[i].User?.fullName ?? null,
                            email: rs.rows[i].User?.email ?? null
                        },
                        originalUser: originalUser,
                        url: rs.rows[i].url,
                        path: rs.rows[i].path,
                        device: rs.rows[i].device,
                        params: rs.rows[i].params,
                        ip: rs.rows[i].ip,
                        module: rs.rows[i].module,
                        action: rs.rows[i].action,
                        method: rs.rows[i].method,
                        dataRequest: rs.rows[i].dataRequest,
                        oldDataRequest: rs.rows[i].oldDataRequest,
                        dataResponse: rs.rows[i].dataResponse,
                        createdAt: rs.rows[i].createdAt,
                        updatedAt: rs.rows[i].updatedAt
                    })
                }
            }
            return response.jsonEncrypt(req, res, {
                status: 1,
                message: 'ok',
                code: 200,
                data: data
            });
        } catch (error) {
            console.log(error)
        }

    }
}
