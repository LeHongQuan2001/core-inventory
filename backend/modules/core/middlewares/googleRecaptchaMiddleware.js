const configs = require('../../../configs/configs');
const response = require('../../../libs/core/response');
const googleRecaptchaService = require('../../../libs/services/googleRecaptchaService');
module.exports = async (req, res, next) => {
    if (!configs.google.isActive) {
        return next();
    }

    try {
        const captcha = req.body.captcha || req.query.captcha || null;
        const result = await googleRecaptchaService.verifyV3(captcha);
        if (result === true) {
            next();
        } else {
            return response.jsonEncrypt(req, res,{
                status: 0,
                code: 400,
                message: `errorVerifyRecaptcha`
            });
        }
    } catch (error) {
        console.log(error)
        return response.jsonEncrypt(req, res,{
            status: 0,
            code: 400,
            message: `errorRecaptcha`
        });
    }
}
