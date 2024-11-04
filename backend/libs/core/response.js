const encryptService = require('../../libs/services/encryptService');
module.exports = {
    jsonEncrypt: (req, res, resData) => {
        try {
            const clientPubKey = req.clientPubKey || null;
            if (clientPubKey === null) {
                return res.json(resData);
            }

            const data = resData.data || false;
            const encryptData = encryptService.encryptResponse(clientPubKey, data);
            resData.data = encryptData;
            return res.json(resData);
        } catch (e) {
            return false;
        }
    },
    getDataEncrypt: (req, resData) => {
        try {
            const clientPubKey = req.clientPubKey || null;
            if (clientPubKey === null) {
                return resData;
            }
            const encryptData = encryptService.encryptResponse(clientPubKey, resData);
            return encryptData;
        } catch (e) {
            return resData;
        }
    }
}
