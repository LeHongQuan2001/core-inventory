const chalk = require('chalk')
const moment = require('moment')
const debug = require('debug')('logger')
const fs = require('fs')
const notificationService = require("./notificationService");
process.env.DEBUG = 'logger'

const loggerService = {
    info: (message, data) => {
        message = chalk.blueBright(`[INFO] - ${moment().format('HH:mm:ss, DD/MM/YYYY')}: ${message}`)
        debug(message)
    },
    warn: (message, data) => {
        message = chalk.yellowBright(`[WARNING] - ${moment().format('HH:mm:ss, DD/MM/YYYY')}: ${message}`)
        debug(message)
    },
    success: (message, data) => {
        message = chalk.greenBright(`[SUCCESS] - ${moment().format('HH:mm:ss, DD/MM/YYYY')}: ${message}`)
        debug(message)
    },
    log: (message, data) => {
        data = typeof data !== 'undefined' ? data : '';
        console.log(message, data)
    },
    error: (message, data) => {
        const string = `[ERROR] - ${moment().format('HH:mm:ss, DD/MM/YYYY')}: ${message}`;
        message = chalk.red(string)
        notificationService.send(string).then(e => {});
        debug(message)
    },
    file: async (filename, data, dirname) => {
        // append data to file
        let logFile = `./logs/${filename}.txt`,
            dir = null
        if (typeof dirname !== 'undefined') {
            logFile = `./logs/${dirname}/${filename}.txt`
            dir = `./logs/${dirname}`
        }

        try {
            if (typeof dirname !== 'undefined' && !fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }
        } catch (err) {
            console.error(err)
        }

        fs.appendFile(logFile, '[' + moment().format('HH:mm:ss DD/MM/YYYY') + ']\t' + data + '\n', {},
            // callback function
            function(err) {
                if (err) throw err;
                // if no error
                const message = chalk.yellow(`[SUCCESS LOG FILE] - ${moment().format('HH:mm:ss, DD/MM/YYYY')}: `) + ` ***  Ghi log thành công vào file ${logFile}`
                //console.error(chalk.red(`[ERROR] - ${moment().format('HH:mm:ss, DD/MM/YYYY')}: `) + message, data)
                debug(message)
            });
    }
}

module.exports = loggerService
