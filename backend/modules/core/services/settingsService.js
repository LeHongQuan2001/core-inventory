const ruleService = require("./ruleService");
const routeService = require("./routerService");

module.exports = {
    getByUser: async (userId) => {
        const routeRules = [];
        const object = 'user';
        const rules = await ruleService.getByObject(object, userId);
        let routesDb = await routeService.getAllFromDB();
        for (const i in routesDb.routes) {
            let allow = 0
            for (const j in rules) {
                if ((rules[j].routeId === null || rules[j].routeId == routesDb.routes[i].id) && rules[j].allow == 1) {
                    allow = 1
                    break;
                }
            }

            if (allow !== 1) {
                continue;
            }

            routeRules.push({
                id: routesDb.routes[i].id,
                //name: routesDb.routes[i].name,
                route: routesDb.routes[i].route,
                //uri: routesDb.routes[i].uri,
                allow: allow === 1 ? true : false
            })
        }
        return routeRules;
    }
}
