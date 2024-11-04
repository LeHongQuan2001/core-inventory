const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args))
const loggerService = require("../../../core/services/loggerService");
const tokenInfoService = {
    get: async (accessToken) => {
        const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`;
        const options = {
            method: 'GET'
        }
        try {
            loggerService.info(`CALL GOOGLE API URL: ${url}, OPTIONS: ${JSON.stringify(options)}`)
            const rawResponse = await fetch(url, options);
            const response = await rawResponse.json();
            return typeof response.email !== 'undefined' && typeof response.email_verified !== 'undefined' ? response : false;
        } catch (e) {
            loggerService.error(`Error call get: URL: ${url}, OPTIONS: ${JSON.stringify(options)}, message: ${e.toString()}`)
            return false;
        }
    }
}

module.exports = tokenInfoService;
