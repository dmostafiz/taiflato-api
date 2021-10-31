const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const express = require('express')
const path = require('path');
const mailTransporter = require('../../../helpers/mailTransporter');
// const sendMail 

exports.sendMail = async (req, res) => {


    // var mailOptions = 

    const mail = await mailTransporter.sendMail({
        from: 'no-reply@israpoly.com',
        to: 'dev.mostafiz@gmail.com',
        subject: 'Verify your email',
        // text: 'That was easy! we sending you mail for testing our application',
        template: 'verify_email',
        context: {
            name:"Mostafiz Rahaman",
        }
    })

    res.send({mail})

    // , function (error, info) {
    //     if (error) {
    //         console.log(error);
    //         res.send({ status: 'error', msg: error.message })
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //         res.send({ status: 'success', msg: 'Message sent successfully!' })
    //     }
    // }

}