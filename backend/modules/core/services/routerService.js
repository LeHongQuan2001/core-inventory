const configs = require('../../../configs/configs');
const configsModels = require("../../../configs/models");
const coreModels = require('../models/index');
const Sequelize = require("sequelize");
const {redisCache} = require("../../../libs/cache/redisCache");
const Op = Sequelize.Op;

const routeModel = configsModels.Route

const KEY_ALL_ROUTES = 'CORE:ROUTE:all_routes'

const routeService = {
    getAllDB: async (reset = false) => {
        const cache = await redisCache.get(KEY_ALL_ROUTES)
        let routes = []
        if (reset || cache == null) {
            const data = await routeModel.findAll();
            for (const i in data) {
                routes.push({
                    id: data[i].dataValues.id,
                    name: data[i].dataValues.name,
                    route: data[i].dataValues.route,
                    uri: data[i].dataValues.uri,
                    uriCrc: data[i].dataValues.uriCrc
                });
            }
            await redisCache.set(KEY_ALL_ROUTES, JSON.stringify(routes))
        } else {
            routes = JSON.parse(cache)
        }
        return routes;
    },
    getAllFromDB: async (criteria, page, limit) => {
        try {
            const where = {}
            if (criteria?.keyword) {
                where.name = {
                    [Op.like]: `%${criteria.keyword}%`
                }
            }

            let options = {};
            if (typeof page == 'undefined' && typeof limit == 'undefined') {
                options = {where};
            } else {
                options = {
                    where: where,
                    offset: limit * (page - 1),
                    limit
                };
            }
            const rs = await routeModel.findAndCountAll(options);
            return {
                routes: rs.rows,
                count: rs.count
            }
        } catch (e) {
            console.log('error', e)
        }
    },
    getAll: (app) => {
        let route, routes = []
        app._router.stack.forEach(function (middleware) {
            if (middleware.route) { // routes registered directly on the app
                //routes.push(middleware.route);
                for (const i in middleware.route.stack) {
                    // console.log('name', middleware.route.stack[i])
                }
            } else if (middleware.name === 'router') { // router middleware
                middleware.handle.stack.forEach(function (handler) {
                    let methods = []
                    const routeMethods = handler.route.methods
                    for (const method in routeMethods) {
                        methods.push(method.toString().toUpperCase())
                    }

                    for (const i in handler.route.stack) {
                        let handleString = handler.route.stack[i].handle.toString()
                        if (handleString.indexOf(configs.app.ruleCheckerMiddlewareDetection) == -1) {
                            continue
                        }
                        // console.log(handler.route)
                        // console.log('handler.route.stack[i].name', handler.route.stack[i].name)
                        // console.log('handler.route.stack[i].handle', handler.route.stack[i].handle.toString())
                        route = handler.route
                    }
                    if (route && routes.find(e => {
                        return e.as == route.path
                    }) == null) {
                        routes.push({
                            as: route.path,
                            action: {
                                as: route.path,
                                controller: null,
                                middleware: []
                            },
                            name: route.name,
                            uri: route.path,
                            vendor: null,
                            package: null,
                            methods: methods,
                            wheres: [],
                            isAllow: 1
                        })
                    }
                })
            }
        })

        return routes
    },
    getById: async (id) => {
        return await coreModels.Route.findByPk(id)
    },
    getByUri: async (uri) => {
        return await coreModels.Route.findOne({
            where: {
                uriCrc: routeModel.sequelize.fn('CRC32', uri)
            }
        });
    },
    getByRoute: async (route) => {
        return await coreModels.Route.findOne({
            where: {
                route
            }
        });
    },
    create: async (data) => {
        const exists = await routeService.getByUri(data.uri)
        if (exists) {
            await exists.update({
                uri: data.uri,
                uriCrc: routeModel.sequelize.fn('CRC32', data.uri),
                status: data.status,
                methods: data.methods
            })
            return false
        }
        const route = routeModel.build(data);
        route.uriCrc = routeModel.sequelize.fn('CRC32', data.uri)
        return await route.save();
    },
    update: async (route, data) => {
        route.changed('updatedAt', true);
        const result = await route.update(data);
        await redisCache.delete(KEY_ALL_ROUTES);
        return result;
    },
    delete: async (route) => {
        const result = await route.destroy();
        await redisCache.delete(KEY_ALL_ROUTES);
        return result;
    }
}

module.exports = routeService
