require('dotenv').load()
const express = require('express')

express.application.prefix = express.Router.prefix = function (path, configure) {
    const router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};

const basicAuth = require('express-basic-auth')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const ip = process.env.IP || 'localhost'
const port = process.env.PORT || 3000
const prefixPath = process.env.PREFIX_PATH || '/'
const apiDocsEnable = process.env.API_DOCS_ENABLE && process.env.API_DOCS_ENABLE == 'true' ? true : false
const configs = require('./configs/configs')
const path = require('path')
const fs = require('fs')
const notificationService = require('./modules/core/services/notificationService')
const moment = require('moment');

global.APP_ROOT_DIR = path.resolve(__dirname);

app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin: configs.app.frontendUrl.split(',')
}));

const timeout = require('connect-timeout');
const response = require("./libs/core/response");
app.use(timeout(configs.app.timeout, {
    respond: true
}));
app.use(haltOnTimedoutMiddleware);

function haltOnTimedoutMiddleware(req, res, next) {
    if (req.timedout) {
        return response.jsonEncrypt(req, res, {
            status: 0,
            code: 408,
            message: `Request Timeout`
        });
    }

    next();
}

// const file = require('./modules/cdp/storage/uploads')
// global
//app.use(basicAuth(configs.auth.basic))

// home page
// if (prefixPath !== '/') {
//     app.get('/', (req, res) => {
//         res.status(200).json({
//             status: 1,
//             message: 'Welcome to ' + process.env.APP_NAME
//         })
//     })
// }

// api docs
if (apiDocsEnable == true) {
    const swaggerFile = require('./swagger/swagger_output.json')
    const swaggerOptions = {
        customSiteTitle: `API documentation - ${configs.app.name}`,
        customCss: '.swagger-ui .topbar { background-color: #fff; box-shadow: 0 5px 5px 0 rgb(0 0 0 / 40%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);} .swagger-ui .topbar a { background: url(https://cloud-bizfly.cdn.vccloud.vn/images/BizFly-Cloud.svg) no-repeat; height: 40px; display: block; width: 168px; margin: 0 auto; } .swagger-ui .topbar a img { display: none }'
    }
    app.use('/api-docs', basicAuth(configs.auth.basic), swaggerUi.serveFiles(swaggerFile), swaggerUi.setup(swaggerFile, swaggerOptions))
}

//joining path of directory
const directoryModulesPath = path.join(__dirname, 'modules')
// routes grouping
app.prefix(`${prefixPath}`, (appGroup) => {
    fs.readdir(directoryModulesPath, function (err, modules) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err)
        }

        //listing all files using forEach
        modules.forEach((module) => {
            try {
                const moduleRoutes = require(`${directoryModulesPath}/${module}/routes/${module}Route`)
                moduleRoutes(appGroup)
            } catch (e) {
                console.log(e)
                //await notificationService.send(e.message)
            }
        })
    })

});

let frontendDist
switch (process.env.APP_ENV) {
    case 'development':
        frontendDist = 'dev'
        break;
    case 'production':
        frontendDist = 'prod'
        break;
    case 'staging':
        frontendDist = 'staging'
        break;
}
if (frontendDist) {
    app.use(express.static('./html/dist/' + frontendDist))
    console.info('Frontend is running in folder ./html/dist/' + frontendDist)
    // rewrite all url of fe to index.html
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '/html/dist/' + frontendDist + '/index.html'), function (err) {
            if (err) {
                res.status(404).send(err)
            }
        })
    })
}

app.use(function(req, res) {
    res.status(404).json({
        status: 0,
        code: 404,
        message: `URL path ${req.originalUrl} not found`
    })
})

app.listen(port, ip);
console.log("Server is running!\nAPI: http://" + ip + ":" + port)
if (apiDocsEnable == true) {
    console.log("API documentation: http://" + ip + ":" + port + "/api-docs")
}

process.on('uncaughtException', function (err) {
    if (err) {
        const message = `[${configs.app.name}] - Có lỗi xảy ra lúc : ${moment().format('HH:mm:ss DD/MM/YYYY')}\n`
            + `- Lỗi: \n`
            + `${err.stack}`;
        notificationService.send(message).then(() => {});
    }
});

if (configs.app.ssl.isActive) {
    try {
        const privateKey = fs.readFileSync(configs.app.ssl.key, 'utf8');
        const certificate = fs.readFileSync(configs.app.ssl.cert, 'utf8');
        const credentials = {key: privateKey, cert: certificate};
        const https = require('https');
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(configs.app.ssl.port, () => {
            console.log("Server is running!\nAPI: https://" + ip + ":" + configs.app.ssl.port)
        });
    } catch (e) {
        console.log(e)
    }
}
