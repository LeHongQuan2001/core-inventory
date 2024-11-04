const response = require('../../../libs/core/response');
const userService = require('../services/userService');
const bcrypt = require("bcrypt");
const moment = require("moment");

module.exports = async (req, res, next) => {
    try {
        const otp = req.body?.otp;
        const user = req.userModel;
        if (otp === false) {
            // send otp to email
            await userService.sendOTP({
                user: user, path: req.path
            });
            return response.jsonEncrypt(req, res,{
                status: 1,
                code: 200,
                message: "ok",
                data: {
                    otp: true,
                    isSend: true
                }
            });
        }
        // verify otp from body
        const otpData = user.getOtpData();
        const otpItem = otpData.find(e => e.path === req.path);
        if (typeof otpItem === 'undefined' || !otpItem || bcrypt.compareSync(otp, otpItem.otp) === false || otpItem.expiresTime <= moment().unix()) {
            return response.jsonEncrypt(req, res,{
                status: 0,
                code: 400,
                message: "InvalidOTP",
                data: {
                    verifyOtp: false
                }
            });
        }

        await userService.update(user, {
            otpData: null
        })
        next();
    } catch (error) {
        console.log('error', error)
        return response.jsonEncrypt(req, res,{
            status: 0,
            code: 400,
            message: "InvalidOTP",
            data: {
                verifyOtp: false
            }
        });
    }
}
