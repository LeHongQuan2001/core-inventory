const coreModels = require('../models/index')
const model = coreModels.Config;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const configService = {
    createOrUpdate: async (key, value) => {
        let config = await configService.getByKey(key);
        if (config) {
            return await config.update({
                value: value
            })
        }

        config = model.build({
            key: key,
            keyCrc: model.sequelize.fn('CRC32', key),
            value: value
        })
        return await config.save();

    },
    getByKey: async (key) => {
        return await model.findOne({
            where: {
                keyCrc: model.sequelize.fn('CRC32', key)
            }
        })
    }
}

module.exports = configService;
