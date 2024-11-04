const featureFlagMiddleware = (params = { feature: null }) => {
    return (req, res, next) => {
        const gb = req.growthbook || null;
        if (!gb) {
            next();
        }

        const user = req.user;
        if (user) {
            gb.setAttributes({
                id: user.id,
                email: user.email,
                roleId: user.roleId
            });
        }

        if (params.feature && !gb.isOn(params.feature)) {
            return res.status(403).json({
                status: 0,
                code: 403,
                messages: ["Access denied!"]
            }).end();
        }

        next();
    }
};

module.exports = featureFlagMiddleware;
