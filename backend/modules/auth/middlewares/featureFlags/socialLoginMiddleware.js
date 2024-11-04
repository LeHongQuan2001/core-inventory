const configs = require('../../../../configs/growthBook');
module.exports = (req, res, next) => {
    try {
        if (configs.enabled === false || typeof req.growthbook === 'undefined') {
            return next();
        }

        const features = configs.features;
        if (!req.growthbook.isOn(features.social.login)) {
            res.status(404).json({
                status: 0,
                code: 404,
                message: "Invalid feature flag"
            }).end();
        }
        next();
    } catch (error) {
        res.status(400).json({
            status: 0,
            code: 400,
            message: "Invalid username or password"
        }).end();
    }
}
