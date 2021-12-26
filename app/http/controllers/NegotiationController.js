const Request = require("../../models/Request")
const User = require("../../models/User")
const jwt = require('jsonwebtoken');
const Thread = require("../../models/Thread");
const Message = require("../../models/Message");
const Activity = require("../../models/Activity");
const getCid = require("../../../helpers/getCid");
const Notification = require("../../models/Notification");
const Property = require("../../models/Property");
var mongoose = require('mongoose');
const Negotiation = require("../../models/Negotiation");
const mailTransporter = require("../../../helpers/mailTransporter");
const errorLogger = require("../../../helpers/errorLogger");


exports.make_negotiation = async (req, res) => {
    const {
        message,
        price,
        requestId,
        threadId
    } = req.body

    // return console.log('propertyId: ', propertyId)

    const token = req.headers.authorization

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const req = await Request.findById(requestId)


            if (req) {

                const existingNeg = await Negotiation.findById(req.negotiation)

                if (existingNeg) {

                    existingNeg.status = 'cancelled'
                    await existingNeg.save()
                }

                const neg = new Negotiation()
                neg.members = req.members
                neg.admin = user._id
                neg.developer = req.developer
                neg.manager = req.manager
                neg.buyer = req.buyer
                neg.property = req.property
                neg.request = req._id
                neg.message = message
                neg.price = price

                await neg.save()

                req.negotiation = neg._id
                await req.save()

                const thread = await Thread.findById(threadId)

                if (thread) {

                    const receiver = thread.members.find(mbr => mbr.toString() != user._id.toString() )

                    // console.log('Current User: ', user._id)
                    // return console.log('Receliver: ', receiver)

                    const msg = new Message()
                    msg.cid = getCid()
                    msg.members = req.members
                    msg.thread = thread._id
                    msg.sender = user._id
                    msg.receiver = receiver
                    msg.text = message
                    msg.price = price
                    msg.property = req.property
                    msg.request = req._id
                    msg.negotiation = neg._id
                    msg.type = 'buy'
                    await msg.save()

                    thread.messages = [...thread.messages, msg._id]
                    thread.newMessages = [...thread.newMessages, msg._id]
                    await thread.save()

                    // return res.json({status:'success', message: msg})
                    console.log('Request: ', req)
                    console.log('Receiver: ', receiver)

                    const notifiedUser = await User.findById(receiver)

                    console.log('Current User: ', user._id)
                    console.log('Receliver: ', receiver)
                    console.log('Notify User: ', notifiedUser)

                    if (notifiedUser) {
                        try {

                            const mail = await mailTransporter.sendMail({
                                from: 'No Reply <no-reply@israpoly.com>',
                                to: notifiedUser.email,
                                subject: 'You got an offer',
                                // text: 'That was easy! we sending you mail for testing our application',
                                template: 'negotiation_msg',
                                context: {
                                    receiver: notifiedUser.username,
                                    sender: user.username,
                                    negotiation_message: neg.message,
                                    negotiation_price: neg.price
                                }
                            })

                            console.log('Mail Sent: ', mail )


                        } catch (error) {
                            console.log('Mail Error: ', error.message)
                            return await errorLogger(error, 'Email send failed')
                        }

                        const not = new Notification()
                        not.cid = getCid()
                        not.sender = user._id 
                        not.user = notifiedUser._id
                        not.text = neg.message
                        not.link = `http://`
                        await not.save()

                    }



                    return res.json({ status: 'success', message: msg })

                }



            }
        }

    } catch (error) {
        console.log('Request Error: ', error.message)
        res.json({ status: 'error', msg: error.message })
        return await errorLogger(error, 'Server Error')

    }

}