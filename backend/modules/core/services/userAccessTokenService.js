const stringHelper = require('../../../libs/helpers/stringHelper');
const models = require('../../../configs/models');
const model = models.UserAccessToken;

const userAccessTokenService = {
    status: {
        activated: 'activated',
        blocked: 'blocked'
    },
    getById: async (id) => {
        try {
            const where = {
                id: stringHelper.uuid.toBinary(id)
            };
            const userAccessToken = await model.findOne({
                where: where
            });
            return userAccessToken;
        } catch (e) {
            return false;
        }
    },
    create: async (data) => {
        try {
            const userAccessToken = model.build({
                userId: data.userId,
                data: JSON.stringify(data.data),
                createdDate: data.createdDate,
                expiredDate: data.expiredDate,
                lifetime: data.lifetime,
                status: userAccessTokenService.status.activated
            });
            return await userAccessToken.save();
        } catch (e) {
            console.log(e)
        }
        return false;
    },
    update: async (userAccessToken, data) => {
        try {

        } catch (e) {
            console.log(e)
        }
        return false;
    },
    search: async (criteria, page = 1, limit = 20) => {
        const where = {}
        const result = await model.findAndCountAll({
            where: where,
            offset: limit * (page - 1),
            limit
        });

        return {
            tokens: result.rows,
            count: result.count
        }
    }
}

module.exports = userAccessTokenService;
