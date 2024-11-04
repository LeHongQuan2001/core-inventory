const routeService = require('../services/routerService')

module.exports = async (req, res, next) => {
    try {
        let routeId = typeof req.params !== 'undefined' && typeof req.params.routeId !== 'undefined' ? parseInt(req.params.routeId) : null
        routeId = routeId != null ?  routeId
                                    : typeof req.body !== 'undefined' && typeof req.body.routeId !== 'undefined' ? parseInt(req.body.routeId) : null
        const route = !isNaN(routeId) ? await routeService.getById(routeId) : null;
        if (null == route) {
            return res.status(404).json({
                status: 0,
                code: 404,
                message: `Route ${routeId} not found!`
            }).end();
        }
        req.route = route;
    } catch (error) {
        res.status(400).json({
            status: 0,
            code: 400,
            message: `Error Route`
        });
    }

    next()
}
