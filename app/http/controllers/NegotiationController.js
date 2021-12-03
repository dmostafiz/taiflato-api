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

        if(user){

            const req = await Request.findById(requestId)


            if(req){

                const existingNeg = await Negotiation.findById(req.negotiation)
                if(existingNeg){
                    existingNeg.status = 'cancelled'
                    await existingNeg.save()
                }
                
                const neg = new Negotiation()
                neg.admin = user._id
                neg.developer = req.developer
                neg.manager = req.manager
                neg.buyer = req.buyer
                neg.property = req.property
                neg.request = req._id
                neg.message = message
                neg.price = price
                await  neg.save()
          
                req.negotiation = neg._id
                await req.save()

                const thread = await Thread.findById(threadId)
                
                if(thread){

                    const msg = new Message()
                    msg.cid = getCid()
                    msg.thread = thread._id
                    msg.sender =  user._id 
                    msg.receiver = user._id == req.manager ? req.buyer : req.manager
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

                    return res.json({status:'success', message: msg})

                }



            }
        }

    } catch (error) {
        console.log('Request Error: ', error.message)
        res.json({ status: 'error', msg: error.message })
    }

}