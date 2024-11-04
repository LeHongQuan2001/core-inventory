const coreSettingsController = require('../controllers/settingsController')
const coreAuthController = require('../controllers/authController')
const coreRoleController = require('../controllers/roleController')
const coreUserController = require('../controllers/userController')
const coreRouteController = require('../controllers/routeController')
const corePermissionController = require('../controllers/permissionController')
const coreFeatureFlagController = require('../controllers/featureFlagController')
const coreLogController = require('../controllers/logController')

const authMiddleware = require('../middlewares/authMiddleware')
const ruleCheckerMiddleware = require('../middlewares/ruleCheckerMiddleware')
const decryptRequestMiddleware = require("../../core/middlewares/decryptRequestMiddleware");
const routeMiddleware = require('../middlewares/routeMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const userMiddleware = require('../middlewares/userMiddleware')
const logMiddleware = require('../middlewares/logMiddleware')
const {roleRequest} = require('../requests/roleRequest')
const {userRequest} = require('../requests/userRequest')
const { body, param } = require('express-validator');
const googleRecaptchaMiddleware = require("../middlewares/googleRecaptchaMiddleware");

module.exports = function(app) {
    app.get('/core/settings/get',
        [authMiddleware, decryptRequestMiddleware], (req, res) => {
            /*  #swagger.tags = ['Core']
                #swagger.description = 'Core - get settings'
                #swagger.security = [{
                    bearer: []
                }]
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Parameters.',
                    required: true,
                    schema: { $routeId: 'integer' }
                }
                #swagger.responses[200] = {
                    schema: { "$ref": "#/definitions/ResponseSuccess" },
                    description: "Successfully." }
            */
            return coreSettingsController.get(req, res)
        })

    app.get(`/core/about`, (req, res) => {
        return res.json({
            status: 1,
            code: 200,
            message: 'DMP API',
        })
    });
    app.post(`/auth/login`,
        // email must be an email
        [decryptRequestMiddleware, googleRecaptchaMiddleware],
        body('email').isEmail(),
        body('password').isLength({ min: 8 }),
        (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Create access token'
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Parameters.',
                required: true,
                schema: { $email: '', $password: ''} }
            #swagger.responses[200] = {
                schema: {
                    status: 1,
                    code: 200,
                    message: "ok",
                    data: {
                        accessToken: 'string',
                        refreshToken: 'string',
                        user: {},
                        role: {}
                    }
                },
                description: "Successfully."
            }
            #swagger.responses[400] = {
                schema: { "$ref": "#/definitions/BadRequest" },
                description: "Bad Request." }
            #swagger.responses[401] = {
                schema: { "$ref": "#/definitions/UnAuthorization" },
                description: "UnAuthorization." }
            #swagger.responses[403] = {
                schema: { "$ref": "#/definitions/Forbidden" },
                description: "Forbidden." }
            #swagger.responses[404] = {
                schema: { "$ref": "#/definitions/NotFound" },
                description: "Not Found." } */
        return coreAuthController.login(req, res)
    })

    app.post(`/auth/logout`,
        body('accessToken').isLength({ min: 20 }),
        [authMiddleware, ruleCheckerMiddleware],
        (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Auth Logout'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
            */
        return coreAuthController.logout(req, res)
    })

    app.post(`/auth/refresh-token`,
        body('refreshToken').isLength({ min: 20 }),
        (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Refresh access token'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.responses[200] = {
                schema: {
                    status: 1,
                    code: 200,
                    message: "ok",
                    data: {
                        accessToken: 'string',
                        refreshToken: 'string'
                    }
                },
                description: "Successfully."
            }
            */
        return coreAuthController.refreshToken(req, res)
    })

    // List roles
    app.get('/core/role/list',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Role list'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
        */
        return coreRoleController.index(req, res)
    })
    // List search
    app.get('/core/role/check-name-exist',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {
            /*  #swagger.tags = ['Core']
                #swagger.description = 'Role list'
                #swagger.security = [{
                    bearer: []
                }]
                #swagger.responses[200] = {
                    schema: { "$ref": "#/definitions/ResponseSuccess" },
                    description: "Successfully." }
            */
            return coreRoleController.checkNameExist(req, res)
        })

    // create new role
    app.post('/core/role/create',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, logMiddleware],
        roleRequest.store(), (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Create new role'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Parameters.',
                required: true,
                schema: { $name: 'string', $status: 'string'}
            }
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
        */
        return coreRoleController.store(req, res)
    })

    // update role
    app.put('/core/role/:roleId/update',
        [authMiddleware, ruleCheckerMiddleware, roleMiddleware, decryptRequestMiddleware, logMiddleware],
        roleRequest.store(),  (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Update role'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Parameters.',
                required: true,
                schema: { $id: 'integer', $name: 'string', $status: 'string'}
            }
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
        */
        return coreRoleController.update(req, res)
    })

    // delete role
    app.delete('/core/role/:roleId/delete',
        [authMiddleware, ruleCheckerMiddleware, roleMiddleware, decryptRequestMiddleware, logMiddleware],
        (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Delete role'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Parameters.',
                required: true,
                schema: { $id: 'integer' }
            }
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
        */
        return coreRoleController.delete(req, res)
    })

    /**
     * Routes
     */
    // List routes
    app.get('/core/route/list',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {
            /*  #swagger.tags = ['Core']
                #swagger.description = 'List routes'
                #swagger.security = [{
                    bearer: []
                }]
                #swagger.responses[200] = {
                    schema: { "$ref": "#/definitions/ResponseSuccess" },
                    description: "Successfully." }
            */
            return coreRouteController.index(req, res)
        })

    // Import routes
    app.get('/core/route/import',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {
            /*  #swagger.tags = ['Core']
                #swagger.description = 'Import routes'
                #swagger.security = [{
                    bearer: []
                }]
                #swagger.responses[200] = {
                    schema: { "$ref": "#/definitions/ResponseSuccess" },
                    description: "Successfully." }
            */
            return coreRouteController.import(req, res)
        })

    app.post('/core/route/:routeId/update',
        param('routeId').isNumeric(),
        [authMiddleware, ruleCheckerMiddleware, routeMiddleware, decryptRequestMiddleware, logMiddleware],
        body('name'),
        body('route'),
        (req, res) => {
            /*  #swagger.tags = ['Core']
                #swagger.description = 'Update routes'
                #swagger.security = [{
                    bearer: []
                }]
                #swagger.responses[200] = {
                    schema: { "$ref": "#/definitions/ResponseSuccess" },
                    description: "Successfully." }
            */
            return coreRouteController.update(req, res)
        })

    // Update route name
    app.post(`/core/route/update/name`,
        body('routeId').isNumeric(),
        body('name').isString(),
        [authMiddleware, ruleCheckerMiddleware, routeMiddleware, decryptRequestMiddleware, logMiddleware],
        (req, res) => {
            /* #swagger.tags = ['Core']
               #swagger.description = 'Update route name' */
            return coreRouteController.updateName(req, res)
        })

    // List users
    app.get('/core/user/list',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'List users'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
        */
        return coreUserController.index(req, res)
    })

    // create new user
    app.post('/core/user/store',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, logMiddleware],
        (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Create new user'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
        */
        return coreUserController.store(req, res)
    })

    // update user
    app.put('/core/user/:userId/update',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, roleMiddleware, userMiddleware, logMiddleware],
        userRequest.store(), (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Update user'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
        */
        return coreUserController.update(req, res)
    })


    // set role user
    app.put('/core/user/:userId/set-role',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, roleMiddleware, userMiddleware, logMiddleware],
        body('roleId').isNumeric(),
        (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Set role user'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
        */
        return coreUserController.setRole(req, res)
    })

    // delete user
    app.delete('/core/user/delete',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, logMiddleware],
        (req, res) => {
        /*  #swagger.tags = ['Core']
            #swagger.description = 'Delete user'
            #swagger.security = [{
                bearer: []
            }]
            #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/ResponseSuccess" },
                description: "Successfully." }
        */
        return coreUserController.delete(req, res)
    })

    /**
     * Permission
     */
    // Get permission detail
    app.get('/core/permission/:objectType/:objectId',
        param('objectType').isIn(['role', 'user']),
        param('objectId').isNumeric(),
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {
            /*  #swagger.tags = ['Core']
                #swagger.description = 'List  of object'
                #swagger.security = [{
                    bearer: []
                }]
                #swagger.responses[200] = {permission
                    schema: { "$ref": "#/definitions/ResponseSuccess" },
                    description: "Successfully." }
            */
            return corePermissionController.detail(req, res)
        })
    // Permission set
    app.post('/core/permission/set/:objectType/:objectId',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, routeMiddleware, logMiddleware],
        param('objectType').isIn(['role', 'user']),
        param('objectId').isNumeric(),
        body('allow').isBoolean(),
        body('routeId').isNumeric(),
        (req, res) => {
            /*  #swagger.tags = ['Core']
                #swagger.description = 'Deny user / role access route'
                #swagger.security = [{
                    bearer: []
                }]
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Parameters.',
                    required: true,
                    schema: { $routeId: 'integer' }
                }
                #swagger.responses[200] = {
                    schema: { "$ref": "#/definitions/ResponseSuccess" },
                    description: "Successfully." }
            */
            return corePermissionController.set(req, res)
        })

    app.post('/core/user/switch-user',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware, logMiddleware],
        body('userId').isEmpty(),
        (req, res) => {
            /*  #swagger.tags = ['Core']
                #swagger.description = 'Core switch user'
                #swagger.security = [{
                    bearer: []
                }]
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Parameters.',
                    required: true,
                    schema: { $routeId: 'integer' }
                }
                #swagger.responses[200] = {
                    schema: { "$ref": "#/definitions/ResponseSuccess" },
                    description: "Successfully." }
            */
            return coreUserController.switchUser(req, res)
        })

    app.get('/core/feature-flag/sync',
        [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
        (req, res) => {
            /*  #swagger.tags = ['Core']
                #swagger.description = 'Core Feature Flag sync data from FF Admicro'
                #swagger.security = [{
                    bearer: []
                }]
                #swagger.parameters['body'] = {}
                #swagger.responses[200] = {
                    schema: { "$ref": "#/definitions/ResponseSuccess" },
                    description: "Successfully." }
            */
            return coreFeatureFlagController.sync(req, res)
        })

    app.get('/core/action-log/list',
            [authMiddleware, ruleCheckerMiddleware, decryptRequestMiddleware],
            (req, res) => {
                /*  #swagger.tags = ['Core']
                    #swagger.description = 'Core log action'
                    #swagger.security = [{
                        bearer: []
                    }]
                    #swagger.responses[200] = {
                        schema: { "$ref": "#/definitions/ResponseSuccess" },
                        description: "Successfully." }
                */
                return coreLogController.index(req, res)
            })
}
