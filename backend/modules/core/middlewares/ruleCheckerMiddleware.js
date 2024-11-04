const ruleService = require('../services/ruleService')
const routeService = require('../services/routerService')

module.exports = async (req, res, next) => {
    // ruleCheckerMiddlewaregmsvdr5PNmw3uK9mEVqsFyQRUMStvVJx6qqWbdL4k6pZXGKarHGrz88FYh63y94x
    const route = req.route || null
    const routePath = route ? route.path : null
    try {
        const user = req.user
        if (typeof user == 'undefined') {
            return res.status(401).json({
                status: 0,
                code: 401,
                message: "Not Authorization."
            });
        }
        const dbRoute = await routeService.getByUri(routePath)

        const canAccess = dbRoute == null ? true : await ruleService.canAccess(user, dbRoute)
        if (canAccess == false) {
            return res.status(403).json({
                status: 0,
                code: 403,
                messages: ["Access denied!"]
            }).end();
        }
        next();
    } catch (error) {
        res.status(400).json({
            status: 0,
            code: 400,
            messages: ["Bad request"]
        }).end();
    }
}
