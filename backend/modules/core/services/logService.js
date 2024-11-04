const models = require('../../../configs/models');
const logModel = models.Log;

const {Op, Sequelize} = require('sequelize');

const logService = {
    getById: async (id) => {
        return await logModel.findByPk(id)
    },
    getByUri: async (uri) => {
        return await logModel.findOne({
            where: {
                uriCrc: logModel.sequelize.fn('CRC32', uri)
            }
        })
    },
    list: async (criteria, page, limit) => {
        const where = {}
        const whereUser = {};
        if (criteria.keyword) {
            whereUser[Op.or] = [
                Sequelize.literal(`User.username LIKE '%${criteria.keyword}%'`),
                {email: {[Op.like]: `%${criteria.keyword}%`}}
            ];
        }

        if (criteria.fd && criteria.td) {
            where.createdAt = {
                [Op.lte]: criteria.td,
                [Op.gte]: criteria.fd
            };
        }

        if (criteria.action) {
            where.action = criteria.action;
        }

        if (criteria.module) {
            where.module = criteria.module;
        }

        return await logModel.findAndCountAll({
            where: where,
            offset: limit * (page - 1),
            limit,
            include: [
                {
                    model: models.User,
                    as: 'User',
                    attributes: ['id', 'email', 'username', 'fullName'],
                    where: whereUser
                },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });
    },
    create: async (data) => {
        const log = logModel.build(data);
        try {
            log.methodCrc = logModel.sequelize.fn('CRC32', data.method);
            log.moduleCrc = logModel.sequelize.fn('CRC32', data.module);
            log.actionCrc = logModel.sequelize.fn('CRC32', data.action);
            return await log.save();
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    getHistory: async (conditions) => {
        try {
            const log = logModel.findOne({
                where: {
                    [Op.and]: [
                        {user_id: conditions.id},
                        {method: conditions.method},
                        {path: conditions.path},
                        {module: conditions.module}
                    ]
                },
                limit: 1,
                order: [['created_at', 'DESC']]
            });
    
            return log;
        } catch (error) {
            return null;
        }
    }
}
module.exports = logService;
