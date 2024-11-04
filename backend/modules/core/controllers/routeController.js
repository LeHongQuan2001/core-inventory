const routeService = require('../services/routerService')
const ruleService = require('../services/ruleService')
const {validationResult} = require("express-validator")
const response = require("../../../libs/core/response");

module.exports = {
    index: async (req, res) => {
        const app = req.app

        const page = req.query.page ? parseInt(req.query.page) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const keyword = req.query.keyword ? decodeURIComponent(req.query.keyword) : null;
        const criteria = {
            keyword,
        }

        const rs = await routeService.getAllFromDB(criteria, page, limit)

        for (const i in rs.routes) {
            rs.routes[i].methods = rs.routes[i].getMethods()
        }

        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            data: {
                routes: rs.routes,
                count: rs.count
            }
        });
    },
    import: async (req, res) => {
        const app = req.app
        const routes = routeService.getAll(app);
        const dbRouterResult = await routeService.getAllFromDB({});
        const dbRouters = dbRouterResult.routes;

        // delete db routes
        for (let i in dbRouters) {
            let exists = routes.find(e => e.uri === dbRouters[i].uri);
            if (typeof exists === 'undefined' || !exists) {
                await routeService.delete(dbRouters[i]);
                await ruleService.deleteByRouteId(dbRouters[i].id);
            }
        }

        for (let i in routes) {
            let data = {
                name: routes[i].uri,
                route: routes[i].uri,
                uri: routes[i].uri,
                status: 1,
                methods: JSON.stringify(routes[i].methods)
            };
            await routeService.create(data)
        }
        // reset cache
        await routeService.getAllDB(true);

        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            data: {
                routes
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                messages: errors.array()
            })
        }

        const route = req.route;
        const data = req.body;
        const updateResult = await routeService.update(route, data)

        return response.jsonEncrypt(req, res, {
            status: 1,
            message: 'ok',
            code: 200,
            data: {
                result: updateResult,
                route: route
            }
        });
    },
    updateName: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                messages: errors.array()
            })
        }

        const body = req.body
        const route = req.route
        const name = body.name.toString().trim() || null

        route.name = name
        const updateResult = await routeService.update(route, {
            name: name
        })

        const data = res.data || {}
        route.methods = route.getMethods()
        data.route = route

        return response.jsonEncrypt(req, res, {
            status: 1,
            code: 200,
            data,
            message: 'success'
        });
    },
    delete: async (req, res) => {
        return res.json({
            status: 1,
            code: 200,
            data: []
        });
    }
}
