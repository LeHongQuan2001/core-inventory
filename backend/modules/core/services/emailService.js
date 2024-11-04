const nodemailer =  require('nodemailer')
const configs = require('../../../configs/configs')
const notificationService = require('../../core/services/notificationService')

module.exports = {
    send: async (to, subject, body, cc = [], bcc = []) => {
        try {
            let transporter = null;
            switch (configs.email.service.toLowerCase()) {
                case 'gmail':
                    transporter = nodemailer.createTransport({ // config mail server
                        service: configs.email.service,
                        auth: {
                            user: configs.email.auth.user,
                            pass: configs.email.auth.pass
                        }
                    })
                    break
                default:
                    transporter = nodemailer.createTransport({ // config mail server
                        host: configs.email.host,
                        port: configs.email.port,
                        secureConnection: configs.email.secure,
                        auth: {
                            user: configs.email.auth.user,
                            pass: configs.email.auth.pass
                        }
                    })
            }

            const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                from: {
                    name: configs.email.from_name,
                    address: configs.email.from
                },
                to: to,
                subject: subject,
                text: 'You recieved message from ' + configs.email.from,
                html: body
            }
            if (typeof cc !== 'undefined' && cc) {
                mainOptions.cc = cc
            }
            if (typeof bcc !== 'undefined' && bcc) {
                mainOptions.bcc = bcc
            }

            return transporter.sendMail(mainOptions, async (err, info) => {
                if (err) {
                    return notificationService.send(`${__filename}: sendMail Error ${err.toString()}`)
                }
                return info
            })
        } catch (e) {
            await notificationService.send(`${__filename}: Error ${e.toString()}`)
        }
        return false;
    }
}
