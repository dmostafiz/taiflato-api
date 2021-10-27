const BuyRequest = require("../../models/BuyRequest")
const User = require("../../models/User")
const jwt = require('jsonwebtoken');
const Thread = require("../../models/Thread");
const Message = require("../../models/Message");
const Activity = require("../../models/Activity");
const getCid = require("../../../helpers/getCid");
const Notification = require("../../models/Notification");
const Property = require("../../models/Property");
var mongoose = require('mongoose');

exports.sendBuyingRequest = async (req, res) => {

  const { price, text, propertyId, developerId } = req.body

  const token = req.headers.authorization
  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const req = new BuyRequest()
      req.cid = getCid()
      req.buyer = user._id
      req.developer = developerId
      req.property = propertyId
      req.coverLetter = text
      req.price = price
      await req.save()

      const property = await Property.findById(propertyId)
      if (property) {
        property.buyRequests = [...property.buyRequests, req._id]
        await property.save()
      }



      const existedThread = await Thread.findOne({
        members:{ $in: [mongoose.Types.ObjectId(user._id)]},
        $and: [
          {
            // members:{ $in: [mongoose.Types.ObjectId(user._id)]},  
            members:{ $in: [mongoose.Types.ObjectId(developerId)]}
          }
        ]

        // $or: [
        //   { 'sender': user._id },
        //   { 'sender': developerId },
        // ],

        // $and: [
        //   {
        //     $or: [
        //       { 'receiver': user._id },
        //       { 'receiver': developerId },
        //     ],
        //   }
        // ]

      })


      // return console.log('Existed Thread: ', existedThread)

      const thread = existedThread ? existedThread : new Thread()

      if (!existedThread) {
        thread.cid = getCid()
        thread.members = [
                            mongoose.Types.ObjectId(user._id), 
                            mongoose.Types.ObjectId(developerId)
                          ]
        await thread.save()
      }

      const msg = new Message()
      msg.cid = getCid()
      msg.thread = thread._id
      msg.sender = user._id
      msg.receiver = developerId
      msg.text = text
      msg.price = price
      msg.property = propertyId
      msg.buyRequest = req._id
      msg.type = 'buy'
      await msg.save()

      thread.messages = [...thread.messages, msg._id]
      thread.newMessages = [...thread.newMessages, msg._id]
      await thread.save()

      console.log('Updated Thread: ', thread)


      const act = new Activity()
      act.cid = getCid()
      act.user = user._id
      act.text = 'You have sent a request to buy a property'
      act.link = `/buyer/buy_property/${propertyId}`
      await act.save()

      const notify = new Notification()
      notify.cid = getCid()
      notify.user = developerId
      notify.text = `<strong>${user.first_name} ${user.last_name}</strong> have sent a buying request to you.`
      notify.link = `/developer/buyer_requests/${req._id}`
      notify.icon = 'exchange'
      await notify.save()

      // console.log(property)

      res.json({ status: 'success', data: req })
    }

  } catch (error) {
    console.log('Request Error: ', error.message)
    res.json({ status: 'error', msg: error.message })
  }
}