const jwt = require('jsonwebtoken')
const configs = require('../../../configs/configs');
const userService = require('../../core/services/userService');

module.exports = {
    signAccessToken: (user) => {
        const secret = configs.jwt.secret;
        const payload = {
            iat: Math.floor(Date.now() / 1000),
            id: user.id,
            userId: user.userId,
            exp: parseInt(parseInt(Math.round(new Date().getTime() / 1000)) + parseInt(configs.jwt.ttl)),
        }
        if (user.originalUser) {
            payload['originalUser'] = user.originalUser;
        }
        return jwt.sign(payload, secret, {
            issuer: configs.app.name,
            algorithm: configs.jwt.algorithm
        })
    },
    verifyAccessToken: async (req, res, next) => {
        try {
            let token = req.header("Authorization");
            token = typeof token !== 'undefined' && token.indexOf('Bearer') >= 0 ? token.split(' ')[1]
                : (typeof req.query.token !== 'undefined' ? req.query.token : false)

            if (!token) return next(res.status(401).json({
                status: 0,
                code: 401,
                message: "Not Authorization"
            }))
            try {
                const decoded = jwt.verify(token, configs.jwt.secret);
                const user = await userService.getById(decoded.id, userService.STATUS_ACTIVE);
                if (!user) {
                    return next(res.status(401).json({
                        status: 0,
                        code: 401,
                        message: "Not Authorization"
                    }))
                }
                req.user = {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    fullName: user.fullName,
                    roleId: user.roleId,
                    roleName: user.Role.name,
                    status: user.status
                };
                if (decoded.originalUser) {
                    req.user.originalUser = decoded.originalUser
                }
                req.token = token;
                next();
            } catch (e) {
                next(res.status(401).json({
                    status: 0,
                    code: 401,
                    message: 'Invalid token'
                }))
            }
        } catch (error) {
            next(res.status(401).json({
                status: 0,
                code: 401,
                message: 'Error Authorization'
            }));
        }
    },
    signRefreshToken: (user) => {
        const secret = configs.jwt.secret_refresh
        const payload = {
            iat: Math.floor(Date.now() / 1000),
            id: user.userId,
            roleId: user.roleId,
            username: user.username,
        }

        return jwt.sign(payload, secret, {
            issuer: configs.app.name,
            //algorithm: configs.jwt.algorithm_refresh,
            expiresIn: configs.jwt.ttl_refresh
        })
    },
    verifyRefreshToken: (refreshToken) => {
        let payload = null
        try {
            const decoded = jwt.verify(refreshToken, configs.jwt.secret_refresh);
            payload = decoded
        } catch (e) {

        }

        return payload
    },
    decodeToken: (token) => {
        try {
            return jwt.decode(token);
        } catch (e) {

        }

        return null;
    },
    signWithPayload: (payload, secretKey) => {
        return jwt.sign(payload, secretKey);
    }
}
