const roleService = require('../services/roleService')

module.exports = async (req, res, next) => {
    let roleId = req.params.roleId !== 'undefined' ? req.params.roleId : null;
    if (roleId == null) {
        roleId = req.body.roleId !== 'undefined' ? req.body.roleId : null;
    }
    const role = roleId && roleId !== -1 ? await roleService.getById(roleId) : roleId;
    if (!role && roleId !== -1) {
        return res.status(404).json({
            status: 0,
            code: 404,
            message: 'dataNotFound'
        }).end()
    }

    req.role = role;
    res.data = res.data || {}
    res.data.role = roleId !== -1 ? {
        id: role.id,
        name: role.name,
    } : false;
    next();
}
