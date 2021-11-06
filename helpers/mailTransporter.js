const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

// var mailTransporter = nodemailer.createTransport({
//     host: 'email-smtp.us-east-1.amazonaws.com',
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: 'AKIAW7OWVSOQ5KPOHLJX',
//       pass: 'BH2CsqzmVnpARn+n/y39zf+CJQAPGHqFisjjahnsHg+e'
//     }
//   });

// var mailTransporter = nodemailer.createTransport({
//     service: 'gmail',
//     // port: 465,
//     // secure: true,
//     auth: {
//         user: 'dev.mr7@gmail.com',
//         pass: '106@Cyberzz02'
//     }
// })

var mailTransporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    // secure: true,
    auth: {
        user: "9655aa95e42b19",
        pass: "b41828e708cded"
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