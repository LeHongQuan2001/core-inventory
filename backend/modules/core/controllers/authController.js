const authService = require('../services/authService')
const { validationResult } = require('express-validator')
const jwtHelper = require('../helpers/jwtHelper')
const userService = require("../services/userService");

module.exports = {
    login: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                code: 400,
                errors: errors.array()
            })
        }

        const body = req.body
        const email = typeof body.email !== 'undefined' ? body.email : null
        const password = typeof body.password !== 'undefined' ? body.password : null
        const authResult = await authService.authenticate(email, password)
        
        if (authResult === false) {
            res.json({
                status: 0,
                code: 400,
                message: 'wrongEmailOrPassword'
            })
            return res.end();
        }

        res.json({
            status: 1,
            code: 200,
            message: 'ok',
            data: {
                user: authResult
            }
        })
        res.end()
    },
    logout: async (req, res) => {
        // const accessToken = req.body.accessToken
        // destroy the accessToken

        res.json({
            status: 1,
            code: 200,
            message: 'ok'
        }).end()
    },
    register: async (req, res) => {

    },
    refreshToken: async (req, res) => {
        try {
            let { refreshToken } = req.body
            if (!refreshToken) {
                return res.status(400).json({
                    status: 0,
                    code: 400,
                    message: 'Bad request'
                })
            }
            const payload = jwtHelper.verifyRefreshToken(refreshToken)
            const user = await userService.getByEmail(payload.email, 1)
            const accessToken = jwtHelper.signAccessToken(user)
            refreshToken = jwtHelper.signRefreshToken(user)

            res.json({
                status: 1,
                code: 200,
                data: {
                    accessToken, refreshToken
                }
            }).end()
        } catch (e) {
        }

        return res.status(400).json({
            status: 0,
            code: 400,
            message: 'Refresh token can not verified'
        })
    }
}
