const userService = require('../services/userService')

module.exports = async (req, res, next) => {
    const userId = req.params.userId !== 'undefined' ? req.params.userId : null;
    const user = await userService.getById(userId);
    if (!user) {
        return res.status(404).json({
            status: 0,
            code: 404,
            message: 'dataNotFound'
        }).end()
    }
    req.userData = user;
    res.data = res.data || {}
    res.data.user = {
        id: user.id,
        name: user.roleId,
    }
    next();
}
