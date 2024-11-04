const models = require('../../../configs/models');
const model = models.Role;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const roleService = {
    SUPER_ADMINISTRATOR: 1,
    ADMINISTRATOR: 2,
    NORMAL_USER: 3,
    REGISTER_USER: 4,
    STATUS_ACTIVE: 1,
    STATUS_DISABLE: -1,
    STATUS_INACTIVE: 0,
    cachePrefix: 'CORE_ROLE_',
    list: async (criteria, page, limit) => {
        const where = {}
        if (criteria.keyword) {
            where.name = {
                [Op.like]: `%${criteria.keyword}%`
            }
        }
        if (typeof criteria.status !== 'undefined') {
            where.status = criteria.status
        }
        return await model.findAndCountAll({
            where: where,
            // offset: limit * page,
            // limit
        });
    },
    checkNameExist: async (name) => {
        return await model.count({
            where: {
                name: name
            }
        });
    },
    getById: async (id) => {
        const where = {
            id: id
        };
        const data = model.cache === true ? await model.getCache(roleService.cachePrefix + id) : false
        let role;
        if (data == false) {
            role = await model.findOne({
                where: where
            });
            if (role && model.cache) {
                await model.setCache(roleService.cachePrefix + id, role);
            }
        } else {
            role = model.build(data, {
                isNewRecord: false
            })
        }
        return role;
    },
    create: async (data) => {
        const role = model.build({
            name: data.name,
            status: data.status,
            permissionLocked: data.permissionLocked
        })
        return await role.save();
    },
    update: async (role, data) => {
        const result = await role.update({
            name: data.name,
            status: data.status,
            permissionLocked: data.permissionLocked,
            data: data.data
        });
        if (model.cache) {
            await model.deleteCache(roleService.cachePrefix + role.id);
            await roleService.getById(role.id);
        }
        return result;
    },
    delete: async (role) => {
        if (model.cache) {
            await model.deleteCache(roleService.cachePrefix + role.id);
        }
        return await role.destroy();
    }
}

module.exports = roleService
