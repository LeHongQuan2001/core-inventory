const options = {
    swagger: '2.0.0',          // By default is null
}
const swaggerAutogen = require('swagger-autogen')(options)
const path = require('path')
const fs = require('fs')
require('dotenv').load()
const ip = process.env.IP || 'localhost'
const port = process.env.PORT || 3000
const prefixPath = process.env.PREFIX_PATH || '/'

const doc = {
    info: {
        version: "1.0.0",
        title: process.env.APP_NAME || 'API Docs',
        description: process.env.APP_DESCRIPTION || "API documentation"
    },
    host: `${ip}:${port}`,
    basePath: prefixPath,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Core",
            "description": ""
        }
    ],
    securityDefinitions: {
        bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header"
        }
    },
    definitions: {
        ResponseSuccess: {
            status: 1,
            code: 200,
            message: "ok",
            data: {}
        },
        ResponseError: {
            status: 0,
            code: 200,
            message: "[Error Message]"
        },
        BadRequest: {
            status: 0,
            code: 400,
            message: "Bad Request"
        },
        NotFound: {
            status: 0,
            code: 404,
            message: "Not Found"
        },
        UnprocessableEntity: {
            status: 0,
            code: 422,
            message: "Unprocessable Entity"
        },
        Forbidden: {
            status: 0,
            code: 403,
            message: "Access Denied"
        },
        UnAuthorization: {
            status: 0,
            code: 401,
            message: "UnAuthorization"
        }
    }
}

//joining path of directory
const directoryModulesPath = path.join(__dirname, 'modules')
const moduleRoutes = []
fs.readdir(directoryModulesPath, function (err, modules) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err)
    }

    //listing all files using forEach
    modules.forEach(function (module) {
        moduleRoutes.push(`./modules/${module}/routes/${module}Route`)
    });
    const outputFile = './swagger/swagger_output.json'
    const endpointsFiles = moduleRoutes

    swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
        //require('./server')           // Your project's root file
    })
});
