require('dotenv').load()
module.exports = {
    app: {
        env: process.env.APP_ENV || 'development',
        name: process.env.APP_NAME || 'App name',
        ruleCheckerMiddlewareDetection: 'ruleCheckerMiddlewaregmsvdr5PNmw3uK9mEVqsFyQRUMStvVJx6qqWbdL4k6pZXGKarHGrz88FYh63y94x',
        frontendUrl: process.env.APP_FRONTEND_URL || '',
        timeout: '300s',
        ssl: {
            isActive: typeof process.env.APP_SSL_ACTIVE !== 'undefined' && process.env.APP_SSL_ACTIVE === 'true' ? true : false,
            port: process.env.APP_SSL_PORT | '',
            key: process.env.APP_SSL_KEY_PATH || '',
            cert: process.env.APP_SSL_CERT_PATH || ''
        },
        template: process.env.APP_TEMPLATE || 'bigdata'
    },
    roles: {
        superAdmin: 1,
        administrator: 2
    },
    modules: typeof process.env.APP_MODULES !== 'undefined' ? process.env.APP_MODULES.split(',') : [],
    google: {
        isActive: typeof process.env.GOOGLE_RECAPTCHA_ACTIVE !== 'undefined' && process.env.GOOGLE_RECAPTCHA_ACTIVE === 'true' ? true : false,
        recaptchaV3: {
            url: process.env.GOOGLE_RECAPTCHA_URL,
            secretKey: process.env.GOOGLE_RECAPTCHA_V3_SECRET_KEY
        },
        email: {
            extensions: typeof process.env.GOOGLE_EMAIL_EXTENSIONS !== 'undefined' ? process.env.GOOGLE_EMAIL_EXTENSIONS.split(',') : [],
        }
    },
    notification: {
        enable: process.env.NOTIFICATION_ENABLE || false,
        chatId: process.env.NOTIFICATION_CHAT_ID || 'xxx',
        token: process.env.NOTIFICATION_TOKEN || 'xxx',
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'xxx',
        port: process.env.MYSQL_PORT || '3306',
        username: process.env.MYSQL_USER || 'xxx',
        password: process.env.MYSQL_PASSWORD || 'xxx',
        database: process.env.MYSQL_DATABASE || 'xxx'
    },
    oldMySql: {
        host: process.env.OLD_MYSQL_HOST || 'xxx',
        port: process.env.OLD_MYSQL_PORT || '3306',
        username: process.env.OLD_MYSQL_USER || 'xxx',
        password: process.env.OLD_MYSQL_PASSWORD || 'xxx',
        database: process.env.OLD_MYSQL_DATABASE || 'xxx'
    },
    logRequest: {
        enabled: typeof process.env.ENABLE_LOG_REQUEST !== 'undefined' && process.env.ENABLE_LOG_REQUEST === 'true'
    },
    database: {
        use_env_variable: 'development',
        development: {
            host: process.env.MYSQL_HOST || 'xxx',
            port: process.env.MYSQL_PORT || '3306',
            username: process.env.MYSQL_USER || 'xxx',
            password: process.env.MYSQL_PASSWORD || 'xxx',
            database: process.env.MYSQL_DATABASE || 'xxx',
            dialect: 'mysql',
            timezone: '+07:00',
            logging: console.log
        },
        staging: {
            host: process.env.MYSQL_HOST || 'xxx',
            port: process.env.MYSQL_PORT || '3306',
            username: process.env.MYSQL_USER || 'xxx',
            password: process.env.MYSQL_PASSWORD || 'xxx',
            database: process.env.MYSQL_DATABASE || 'xxx',
            dialect: 'mysql',
            timezone: '+07:00',
            logging: console.log
        },
        test: {
            host: process.env.MYSQL_HOST || 'xxx',
            port: process.env.MYSQL_PORT || '3306',
            username: process.env.MYSQL_USER || 'xxx',
            password: process.env.MYSQL_PASSWORD || 'xxx',
            database: process.env.MYSQL_DATABASE || 'xxx',
            dialect: 'mysql',
            timezone: '+07:00',
            logging: console.log
        },
        production: {
            host: process.env.MYSQL_HOST || 'xxx',
            port: process.env.MYSQL_PORT || '3306',
            username: process.env.MYSQL_USER || 'xxx',
            password: process.env.MYSQL_PASSWORD || 'xxx',
            database: process.env.MYSQL_DATABASE || 'xxx',
            dialect: 'mysql',
            timezone: '+07:00'
        }
    },
    redis: {
        cache: {
            host: process.env.REDIS_CACHE_HOST || 'xxx',
            port: process.env.REDIS_CACHE_PORT || 'xxx',
            auth: process.env.REDIS_CACHE_AUTH || 'xxx',
            db: process.env.REDIS_CACHE_DB || 'xxx'
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'xxx',
        algorithm: process.env.JWT_ALGORITHM || 'xxx',
        ttl: process.env.JWT_TTL || 30 * 24 * 60 * 60, // default: 30 days
        secret_refresh: process.env.JWT_SECRET_REFRESH || 'xxx',
        algorithm_refresh: process.env.JWT_ALGORITHM_REFRESH || 'xxx',
        ttl_refresh: 365, // days
        expiresIn: 365 // days
    },
    auth: {
        basic: {
            users: {'admin': '123'}, challenge: true, realm: 'foo'
        }, encrypt: {
            algorithm: process.env.ENCRYPT_ALGORITHM || 'aes-256-ctr',
            secretKey: process.env.ENCRYPT_SECRET_KEY || 'xxx',
        }
    },
    email: {
        service: process.env.EMAIL_TYPE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        from: process.env.EMAIL_FROM,
        from_name: process.env.EMAIL_FROM_NAME,
        cc: typeof process.env.EMAIL_CC !== 'undefined' ? process.env.EMAIL_CC.split(',') : null,
        bcc: typeof process.env.EMAIL_BCC !== 'undefined' ? process.env.EMAIL_BCC.split(',') : null
    },
    admicro: {
        sso: {
            domain: process.env.ADMICRO_SSO_DOMAIN || 'xxx',
            key: process.env.ADMICRO_SSO_KEY || 'xxx',
            serviceUrl: process.env.SSO_SERVICE_URL || 'xxx',
            apis: {
                login: 'user/login',
                userInfo: 'user/info'
            }
        },
        analytics: {
            serviceUrl: process.env.ANALYTICS_SERVICE_URL || 'xxx',
            appKey: process.env.ANALYTICS_AUTH_APP_KEY || 'xxx',
            username: process.env.ANALYTICS_AUTH_USERNAME || 'xxx',
            password: process.env.ANALYTICS_AUTH_PASSWORD || 'xxx',
            apis: {
                getToken: 'auth/create-access-token',
                login: 'auth/login',
            }
        }
    },
    storage: {
        upload: {
            tmp: {
                path: 'storage/uploads/tmp'
            }, path: 'storage/uploads'
        }
    },
    web: {
        rsa: {
            isActive: typeof process.env.WEB_RSA_IS_ACTIVE !== 'undefined' && process.env.WEB_RSA_IS_ACTIVE === 'true' ? true : false,
            privateKey: typeof process.env.WEB_RSA_PRIVATE_KEY !== 'undefined' ? process.env.WEB_RSA_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
            publicKey: typeof process.env.WEB_RSA_PUBLIC_KEY !== 'undefined' ? process.env.WEB_RSA_PUBLIC_KEY.replace(/\\n/g, '\n') : null
        }
    },
    social: {
        google: {
            appID: process.env.GOOGLE_APP_CLIENT_ID,
            appSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        facebook: {
            appID: process.env.FACEBOOK_APP_CLIENT_ID,
            appSecret: process.env.FACEBOOK_APP_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL
        }
    },
    featureFlag: {
        keyName: 'feature_flags'
    }
}
