const coreModels = require('../models/index');
const emailService = require('../../core/services/emailService');
const configs = require('../../../configs/configs');
const stringHelper = require('../../../libs/helpers/stringHelper');
const ejs = require("ejs");
const path = require("path");
const bcrypt = require("bcrypt");
const moment = require("moment");
const model = coreModels.User;
const {QueryTypes} = require('sequelize');

const userService = {
    cachePrefix: 'CORE_USER_',
    STATUS_ACTIVE: 1,
    filter: async (options, offset, limit) => {
        const where = options
        if (typeof where.email !== 'undefined') {
            const keyword = options.email;
            delete where.email;
            where[coreModels.Sequelize.Op.or] = {
                email: {
                    [coreModels.Sequelize.Op.like]: `%${keyword}%`
                },
                fullName: {
                    [coreModels.Sequelize.Op.like]: `%${keyword}%`
                }
            }
        }

        try {
            const users = model.findAndCountAll({
                where: where,
                limit, offset
            })
            return users;
        } catch (e) {
            return {
                rows: [],
                count: 0
            };
        }
    },
    getById: async (id, status) => {
        try {
            let where = {
                id: id
            }
            if (typeof status !== 'undefined') {
                where.status = status
            }
            let user = null;
            const data = model.cache === true ? await model.getCache(userService.cachePrefix + where.id) : false;
            if (data == false) {
                user = await coreModels.User.findOne({
                    where: where,
                    include: [{
                        model: coreModels.Role,
                        as: 'Role',
                        attributes: ['name']
                    }]
                });
                if (user && model.cache && user.status === userService.STATUS_ACTIVE) {
                    await model.setCache(userService.cachePrefix + where.id, user)
                }
            } else {
                user = model.build(data, {
                    isNewRecord: false
                })
                if (data.Role) {
                    user.Role = coreModels.Role.build(data.Role, {
                        isNewRecord: false
                    });
                }
            }
            return user
        } catch (e) {
            console.log('error', e)
        }
    },
    getByEmail: async (email, status) => {
        try {
            let where = {
                email: email
            }
            if (typeof status !== 'undefined') {
                where.status = status
            }

            let user;
            const data = model.cache === true ? await model.getCache(userService.cachePrefix + where.email) : false
            if (data == false) {
                user = await coreModels.User.findOne({
                    where: where
                });
                if (user && model.cache) {
                    await model.setCache(userService.cachePrefix + where.email, user)
                }
            } else {
                user = model.build(data, {
                    isNewRecord: false
                })
            }
            return user
        } catch (e) {
            console.log('error', e)
        }
    },
    getByUsername: async (username, status) => {
        let where = {
            username
        }
        if (typeof status !== 'undefined') {
            where.status = status
        }

        let user;
        const data = model.cache === true ? await model.getCache(userService.cachePrefix + where.username) : false
        if (data === false) {
            user = await coreModels.User.findOne({
                where: where
            });
            if (user && model.cache) {
                await model.setCache(userService.cachePrefix + where.username, user)
            }
        } else {
            user = model.build(data, {
                isNewRecord: false
            })
        }
        return user
    },
    update: async (user, data) => {
        if (model.cache) {
            await model.deleteCache(userService.cachePrefix + user.email);
            await model.deleteCache(userService.cachePrefix + user.id);
        }
        return await user.update(data);
    },
    getAll: async (options) => {
        const where = options
        try {
            const users = model.findAndCountAll({
                where: where,
            })
            return users;
        } catch (e) {
            return {
                rows: [],
                count: 0
            };
        }
    },
    sendOTP: async (args = {
        user: null, path: null
    }) => {
        const user = args.user;

        // generate otp
        const otp = stringHelper.getRandomNumber(6);
        const otpData = []//user.getOtpData();
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(otp, salt);

        otpData.push({
            path: args.path,
            otp: hash,
            expiresTime: moment().unix() + 5 * 60
        });
        await user.update({
            otpData: JSON.stringify(otpData)
        });

        if (model.cache) {
            await model.deleteCache(userService.cachePrefix + user.email);
            await model.deleteCache(userService.cachePrefix + user.id);
        }

        const templateDirPath = path.join(APP_ROOT_DIR, 'templates', configs.app.template)
        //
        const emailSendOTPTemplate = path.join(templateDirPath, 'core/user/email/sendOTP.ejs')
        const html = await ejs.renderFile(emailSendOTPTemplate, { fullName: user.fullName, otp: otp });
        return await emailService.send(user.email, 'Bigdata Adtech - OTP', html, [], []);
    }
}

module.exports = userService
