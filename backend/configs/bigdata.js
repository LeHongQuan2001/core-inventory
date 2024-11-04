require('dotenv').load();
module.exports = {
    bigDataPlatform: {
        host: process.env.BIGDATA_PLATFORM_SERVICE_HOST || '',
        port: process.env.BIGDATA_PLATFORM_SERVICE_PORT || '',
        ssl: !!(process.env.BIGDATA_PLATFORM_SERVICE_SECURE && process.env.BIGDATA_PLATFORM_SERVICE_SECURE === 'true'),
        prefixPath: process.env.BIGDATA_PLATFORM_SERVICE_PATH || '',
        paths: {
            audience: {

            },
            groupProduct: {

            }
        }
    }
}
