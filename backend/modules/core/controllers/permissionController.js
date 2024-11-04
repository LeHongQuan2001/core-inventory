const ruleService = require('../services/ruleService');
const routeService = require('../services/routerService');
const { validationResult } = require('express-validator');
const response = require("../../../libs/core/response");

module.exports = {
    detail: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.jsonEncrypt(req, res, {
                status: 0,
                message: 'Error',
                code: 400,
                data: {}
            });
        }

        const routeRules = [];
        const featureFlags = [];
        try {
            const object = req.params.objectType;
            const objectId = parseInt(req.params.objectId);
            const rules = await ruleService.getByObject(object, objectId);
            let routesDb = await routeService.getAllDB();
            for (const i in routesDb) {
                let allow = 0,
                    type = 'role';
                for (const j in rules) {
                    if ((rules[j].routeId === null || rules[j].routeId == routesDb[i].id)) {
                        allow = rules[j].allow === 1 ? 1 : 0;
                        type = rules[j].type;
                        break;
                    }
                }
                routeRules.push({
                    route: routesDb[i], allow, type
                })
            }
        } catch (e) { console.log('e', e); }
        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            data: {
                routes: routeRules
            }
        });
    },
    set: async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                code: 400,
                errors: errors.array()
            })
        }

        const objectType = req.params.objectType
        const objectId = req.params.objectId
        const route = req.route
        const allow = req.body.allow

        const rule = await ruleService.set(objectType, objectId, route, allow)
        await ruleService.getAll(true)

        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            data: {
                route,
                allow: allow
            }
        });
    }
}
