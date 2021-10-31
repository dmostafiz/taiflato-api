const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const path = require('path')


var mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 465,
    // secure: true,
    auth: {
        user: 'dev.mr7@gmail.com',
        pass: '106@Cyberzz02'
    }
})

mailTransporter.use('compile', hbs({
    viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve('./views/mails'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/mails'),
    extName: ".hbs",
}))

module.exports = mailTransporter