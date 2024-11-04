const bcrypt = require("bcrypt");
const userService = require('../services/userService')
const roleService = require('../services/roleService')
const jwtHelper = require('../helpers/jwtHelper')
const {md5} = require("request/lib/helpers");
const configs = require("../../../configs/configs");

const authService = {
    authenticate: async (email, password) => {
        const user = await userService.getByEmail(email, 1)
        if (user == null) {
            return false;
        }

        const passwordHash = user.password;
        const hash = md5(password + user.id.toString());
        const checkPasswordHash = bcrypt.compareSync(hash, passwordHash)
        if (checkPasswordHash === false) {
            return false;
        }

        const accessToken = jwtHelper.signAccessToken(user)
        const refreshToken = jwtHelper.signRefreshToken(user)

        return {
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            roleId: user.roleId ? parseInt(user.roleId) : null,
            accessToken,
            refreshToken,
            createdTime: Math.floor((new Date()).getTime() / 1000),
            expiresIn: parseInt(configs.jwt.ttl)
        }
    },
    create: () => {

    }
}

module.exports = authService
