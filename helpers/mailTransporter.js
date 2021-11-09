const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
// const mailgun = require('nodemailer-mailgun-transport');

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

// var mailTransporter = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     // secure: true,
//     auth: {
//         user: "9655aa95e42b19",
//         pass: "b41828e708cded"
//     }
// })

var auth = {
    auth: {
      api_key: '08eb29fea91f5d00581943d1c4b05e92-10eedde5-789eedd1',
      domain: 'mg.mybillplan.com'
    }
}
  
const mailTransporter = nodemailer.createTransport( {
    host: 'smtp.mailgun.org',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'postmaster@mg.mybillplan.com', // generated ethereal user
        pass: 'c64aa8d2635c2de2f0330bff1685158d-10eedde5-fd5184a5'  // generated ethereal password
    },
} )

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