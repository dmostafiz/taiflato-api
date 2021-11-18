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

exports.sendBuyingRequest = async (req, res) => {

  const { price, text, propertyId, developerId } = req.body

  // return console.log('propertyId: ', propertyId)

  const token = req.headers.authorization
  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const req = new Request()
      req.cid = getCid()
      req.admin = developerId
      req.buyer = user._id
      req.developer = developerId
      req.property = propertyId
      req.coverLetter = text
      req.request_type = 'buy'
      req.price = price
      await req.save()

      const property = await Property.findById(propertyId)
      if (property) {
        property.requests = [...property.requests, req._id]
        await property.save()
      }



      const existedThread = await Thread.findOne({
        members: { $in: [mongoose.Types.ObjectId(user._id)] },
        $and: [
          {
            // members:{ $in: [mongoose.Types.ObjectId(user._id)]},  
            members: { $in: [mongoose.Types.ObjectId(developerId)] }
          }
        ]
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
      msg.request = req._id
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
      notify.link = `/developer/requests/${req._id}`
      notify.icon = 'exchange'
      await notify.save()

      // console.log(property)

      res.json({ status: 'success', data: req, thread: thread })
    }

  } catch (error) {
    console.log('Request Error: ', error.message)
    res.json({ status: 'error', msg: error.message })
  }
}

exports.sendOfferRequest = async (req, res) => {

  const { price, text, propertyId, developerId } = req.body

  const token = req.headers.authorization
  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const req = new Request()
      req.cid = getCid()
      req.admin = developerId
      req.buyer = user._id
      req.developer = developerId
      req.property = propertyId
      req.coverLetter = text
      req.request_type = 'offer'
      req.price = price
      await req.save()

      const property = await Property.findById(propertyId)
      if (property) {
        property.requests = [...property.requests, req._id]
        await property.save()
      }



      const existedThread = await Thread.findOne({
        members: { $in: [mongoose.Types.ObjectId(user._id)] },
        $and: [
          {
            // members:{ $in: [mongoose.Types.ObjectId(user._id)]},  
            members: { $in: [mongoose.Types.ObjectId(developerId)] }
          }
        ]

      })

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
      msg.request = req._id
      msg.type = 'offer'
      await msg.save()

      thread.messages = [...thread.messages, msg._id]
      thread.newMessages = [...thread.newMessages, msg._id]
      await thread.save()

      console.log('Updated Thread: ', thread)


      const act = new Activity()
      act.cid = getCid()
      act.user = user._id
      act.text = 'You have sent an offer to buy a property'
      act.link = `/buyer/offer/${propertyId}`
      await act.save()

      const notify = new Notification()
      notify.cid = getCid()
      notify.user = developerId
      notify.text = `<strong>${user.first_name} ${user.last_name}</strong> have sent an offer to you.`
      notify.link = `/developer/requests/${req._id}`
      notify.icon = 'exchange'
      await notify.save()

      // console.log(property)

      res.json({ status: 'success', data: req, thread: thread })
    }

  } catch (error) {
    console.log('Request Error: ', error.message)
    res.json({ status: 'error', msg: error.message })
  }
}

exports.sendMeetingRequest = async (req, res) => {

  const { appoinmentDate, text, propertyId, developerId } = req.body

  const token = req.headers.authorization
  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const req = new Request()
      req.cid = getCid()
      req.admin = developerId
      req.buyer = user._id
      req.developer = developerId
      req.property = propertyId
      req.coverLetter = text
      req.request_type = 'meet'
      req.meetingDate = appoinmentDate
      await req.save()

      const property = await Property.findById(propertyId)
      if (property) {
        property.requests = [...property.requests, req._id]
        await property.save()
      }



      const existedThread = await Thread.findOne({
        members: { $in: [mongoose.Types.ObjectId(user._id)] },
        $and: [
          {
            // members:{ $in: [mongoose.Types.ObjectId(user._id)]},  
            members: { $in: [mongoose.Types.ObjectId(developerId)] }
          }
        ]

      })

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
      msg.meetingDate = appoinmentDate
      msg.property = propertyId
      msg.request = req._id
      msg.type = 'meet'
      await msg.save()

      thread.messages = [...thread.messages, msg._id]
      thread.newMessages = [...thread.newMessages, msg._id]
      await thread.save()

      console.log('Updated Thread: ', thread)


      const act = new Activity()
      act.cid = getCid()
      act.user = user._id
      act.text = 'You have sent a appoinment request'
      act.link = `/buyer/request_appoinment/${propertyId}`
      await act.save()

      const notify = new Notification()
      notify.cid = getCid()
      notify.user = developerId
      notify.text = `<strong>${user.first_name} ${user.last_name}</strong> have sent an offer to you.`
      notify.link = `/developer/requests/${req._id}`
      notify.icon = 'exchange'
      await notify.save()

      // console.log(property)

      res.json({ status: 'success', data: req, thread: thread })
    }

  } catch (error) {
    console.log('Request Error: ', error.message)
    res.json({ status: 'error', msg: error.message })
  }
}

exports.response_request = async (req, res) => {

  const { type, requestId } = req.body

  const token = req.headers.authorization

  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })



    if (user) {

      const req = await Request.findById(requestId)

      console.log('Req Admin: ', req.admin, type)
      console.log('Req User : ', user._id, type)

      if (String(req.admin) == String(user._id)) {

        
        if (type == 'cancel') {
          req.status = 'cancelled'
        }

        await req.save()

        console.log('Req Canceled: ', req)
      }


      // const property = await Property.findById(propertyId)
      // if (property) {
      //   property.buyRequests = [...property.buyRequests, req._id]
      //   await property.save()
      // }



      // const existedThread = await Thread.findOne({
      //   members:{ $in: [mongoose.Types.ObjectId(user._id)]},
      //   $and: [
      //     {
      //       // members:{ $in: [mongoose.Types.ObjectId(user._id)]},  
      //       members:{ $in: [mongoose.Types.ObjectId(developerId)]}
      //     }
      //   ]

      // })

      // const thread = existedThread ? existedThread : new Thread()

      // if (!existedThread) {
      //   thread.cid = getCid()
      //   thread.members = [
      //                       mongoose.Types.ObjectId(user._id), 
      //                       mongoose.Types.ObjectId(developerId)
      //                     ]
      //   await thread.save()
      // }

      // const msg = new Message()
      // msg.cid = getCid()
      // msg.thread = thread._id
      // msg.sender = user._id
      // msg.receiver = developerId
      // msg.text = text
      // msg.price = price
      // msg.property = propertyId
      // msg.request = req._id
      // msg.type = 'offer'
      // await msg.save()

      // thread.messages = [...thread.messages, msg._id]
      // thread.newMessages = [...thread.newMessages, msg._id]
      // await thread.save()

      // console.log('Updated Thread: ', thread)


      // const act = new Activity()
      // act.cid = getCid()
      // act.user = user._id
      // act.text = 'You have sent an offer to buy a property'
      // act.link = `/buyer/offer/${propertyId}`
      // await act.save()

      // const notify = new Notification()
      // notify.cid = getCid()
      // notify.user = developerId
      // notify.text = `<strong>${user.first_name} ${user.last_name}</strong> have sent an offer to you.`
      // notify.link = `/developer/requests/${req._id}`
      // notify.icon = 'exchange'
      // await notify.save()

      // console.log(property)




      res.json({ status: 'success', request: req })
    }

  } catch (error) {
    console.log('Request Error: ', error.message)
    res.json({ status: 'error', msg: error.message })
  }
}