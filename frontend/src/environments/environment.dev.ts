export const environment = {
    production: false,
    appPrefix: "app_vccorp_cdp_dev_",
    baseHref: "/",
    administratorPrefix: "administrator",
    locale: {
        default: "vi",
        list: ['vi', 'en'],
        version: "20220629200022",
    },
    google: {
        clientVerify: true,
        recaptchaV3: {
            siteKey: '6Lc6YyYqAAAAADsfmCt-5uiTGrkegeql7rQ3XEn0'
        }
    },
    rsa: {
        isActive: false,
        server: {
            publicKeyEncode: ''
        }
    },
    roles: {
        superAdmin: 1,
        admin: 2,
        dmpAdmin: 5,
        user: 3
    },
    admicroSso: {
        termOfService: 'https://adx.admicro.vn/vn/tos',
        register: 'https://sso.admicro.vn/signup',
        linkForgotPassword: 'https://sso.admicro.vn/password/lost',
    },
    backendServer: {
        host: '',
        port: 443,
        prefix: 'api/v1',
        url: '',
        paths: {
            auth: {
                login: "admicro-sso/auth/login",
                logout: "auth/logout",
                social: {
                    request: "auth/{SOCIAL_NAME}/request",
                    callback: "auth/{SOCIAL_NAME}/callback",
                },
                google: {
                    request: "auth/google/request",
                    callback: "auth/google/callback",
                },
                otpVerify: "auth/otp/verify"
            },
            admicro: {
                signUp: '',
                forgotPassword: ''
            },
            core: {
                settings: {
                    get: 'core/settings/get'
                }
            },
            administrator: {
                role: {
                    list: 'core/role/list',
                    checkNameExist: 'core/role/check-name-exist',
                    create: 'core/role/create',
                    update: 'core/role/{ROLE_ID}/update',
                    delete: 'core/role/{ROLE_ID}/delete'
                },
                user: {
                    list: 'core/user/list',
                    create: 'core/user/create',
                    update: 'core/user/{USER_ID}/update',
                    setRole: 'core/user/{USER_ID}/set-role',
                    switchUser: 'core/user/switch-user',
                    editAvatar: 'core/user/update-avatar',
                    changePassword: 'user/{USER_ID}/change-password'
                },
                route: {
                    list: 'core/route/list',
                    import: 'core/route/import',
                    update: 'core/route/{ROUTE_ID}/update'
                },
                permission: {
                    details: 'core/permission',
                    set: 'core/permission/set',
                    setDomain: 'core/permission/set-domain',
                    setExtra: 'core/permission/set-extra',
                    setUserRole: 'core/permission/set-role/user'
                },
                actionLog: {
                    list: 'core/action-log/list'
                }
            },
            cdp: {
            
            }
        }
    },
    growthBook: {
        enabled: false,
        encrypt: true,
        apiHost: 'https://ff-proxy.admicro.vn',
        clientKey: 'sdk-9zxqTOo0lBFwh0Ga',
        decryptionKey: 'jkpnE9ouKyOC8TM0bWrpRw==',
        devMode: true,
        features: {}
    }
};
