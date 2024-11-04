const configService = require('../services/configService');

module.exports = {
    sync: async (req, res) => {
        const gb = req.growthbook || null;
        if (!gb) {
            return res.status(400).json({
                status: 0,
                code: 400,
                errors: ['Growthbook is null']
            })
        }

        const flags = gb.getFeatures();
        const result = await configService.createOrUpdate('feature_flags', JSON.stringify(flags));
        return res.json({
            status: 1,
            code: 200,
            data: {
                flags: flags
            }
        });
    }
}
