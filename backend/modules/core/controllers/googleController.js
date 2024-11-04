const configs = require('../../../configs/configs');
const rsaHelper = require('../../../libs/helpers/rsaHelper');

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const oauth2Client = new google.auth.OAuth2(configs.google.api.web.client_id, configs.google.api.web.client_secret, configs.google.api.web.redirect_uris[0]);
const scopesConfig = configs.google.api.scopes;

module.exports = {
    request: async (req, res) => {
        const type = req.query.type || 'sheet';
        // Access scopes for read-only Drive activity.
        const scopes = scopesConfig[type] || [];
        // Generate a url that asks permissions for the Drive activity scope
        const authorizationUrl = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline', /** Pass in the scopes array defined above.
             * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
            scope: scopes, // Enable incremental authorization. Recommended as a best practice.
            include_granted_scopes: true,
            prompt: 'consent'
        });
        res.writeHead(301, {"Location": authorizationUrl}).end();
    }, callback: async (req, res) => {
        const user = req.user;
        const googleCode = req.query.code || null;
        const data = {
            accessToken: null,
            refreshToken: null
        };
        let status = 0, code = 400;

        try {
            const formatKey = 'public';
            const publicKeyResult = await bigdataUserService.getPublicKey(user);
            const publicKey = publicKeyResult.publicKey;


            const tokenResult = await oauth2Client.getToken(googleCode);
            const tokens = tokenResult.tokens;

            // console.log('tokens', tokens)

            const accessToken = tokens.access_token;
            const refreshToken = tokens.refresh_token;

            if (accessToken) {
                data.accessToken = rsaHelper.encrypt(accessToken, publicKey, formatKey);
            }

            if (refreshToken) {
                data.refreshToken = rsaHelper.encrypt(refreshToken, publicKey, formatKey);
            }

            status = 1;
            code = 200;

        } catch (e) {
            console.log('error', e.toString());
        }

        res.json({
            status: status,
            code: code,
            message: 'ok',
            data
        }).end()
    }
}
