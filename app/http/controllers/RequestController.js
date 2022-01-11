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
const Appointment = require("../../models/Appointment");

exports.sendBuyingRequest = async (req, res) => {

  const { price, text, propertyId, developerId } = req.body

  // return console.log('propertyId: ', propertyId)

  const token = req.headers.authorization
  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {


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

      const req = new Request()
      req.cid = getCid()
      req.members = thread.members
      req.admin = developerId
      req.buyer = user._id
      req.developer = developerId
      req.property = propertyId
      req.coverLetter = text
      req.request_type = 'buy'
      // req.price = price
      await req.save()

      const neg = new Negotiation()
      req.members = thread.members
      neg.admin = user._id
      neg.developer = developerId
      neg.manager = developerId
      neg.buyer = user._id
      neg.property = propertyId
      neg.request = req._id
      neg.message = text
      neg.price = price
      await neg.save()

      req.negotiation = neg._id
      await req.save()

      const property = await Property.findById(propertyId)
      if (property) {
        property.requests = [...property.requests, req._id]
        await property.save()
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
      msg.negotiation = neg._id
      msg.type = 'buy'
      await msg.save()

      thread.messages = [...thread.messages, msg._id]
      thread.newMessages = [...thread.newMessages, msg._id]
      await thread.save()

      // console.log('Updated Thread: ', thread)


      const act = new Activity()
      act.cid = getCid()
      act.user = user._id
      act.text = 'You have sent a request to buy a property'
      act.link = `/buyer/buy_property/${propertyId}`
      await act.save()

      const notify = new Notification()
      notify.cid = getCid()
      notify.user = developerId
      notify.text = `<strong>${user.first_name} ${user.last_name}</strong> have sent you a buying request.`
      notify.link = `/developer/messages?thread=${thread._id}`
      notify.icon = 'exchange'
      await notify.save()

      // console.log(property)

      res.json({ status: 'success', data: req, thread: thread })
    }

  } catch (error) {
    // console.log('Request Error: ', error.message)
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

      // const req = new Request()
      // req.cid = getCid()
      // req.admin = developerId
      // req.buyer = user._id
      // req.developer = developerId
      // req.property = propertyId
      // req.coverLetter = text
      // req.request_type = 'offer'
      // req.price = price
      // await req.save()


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

      const req = new Request()
      req.cid = getCid()
      req.members = thread.members
      req.admin = developerId
      req.buyer = user._id
      req.developer = developerId
      req.property = propertyId
      req.coverLetter = text
      req.request_type = 'offer'
      // req.price = price
      await req.save()

      const neg = new Negotiation()
      req.members = thread.members
      neg.admin = user._id
      neg.developer = developerId
      neg.manager = developerId
      neg.buyer = user._id
      neg.property = propertyId
      neg.request = req._id
      neg.message = text
      neg.price = price
      await neg.save()

      const property = await Property.findById(propertyId)
      if (property) {
        property.requests = [...property.requests, req._id]
        await property.save()
      }

      const msg = new Message()
      msg.cid = getCid()
      req.members = thread.members
      msg.thread = thread._id
      msg.sender = user._id
      msg.receiver = developerId
      msg.text = text
      msg.price = price
      msg.property = propertyId
      msg.request = req._id
      msg.negotiation = neg._id
      msg.type = 'offer'
      await msg.save()

      thread.messages = [...thread.messages, msg._id]
      thread.newMessages = [...thread.newMessages, msg._id]
      await thread.save()

      // console.log('Updated Thread: ', thread)


      const act = new Activity()
      act.cid = getCid()
      act.user = user._id
      act.text = 'You have sent an offer to buy a property'
      act.link = `/buyer/offer/${propertyId}`
      await act.save()

      const notify = new Notification()
      notify.cid = getCid()
      notify.user = developerId
      notify.text = `<strong>${user.first_name} ${user.last_name}</strong> have sent you an offer.`
      notify.link = `/developer/messages?thread=${thread._id}`
      notify.icon = 'exchange'
      await notify.save()

      // console.log(property)

      res.json({ status: 'success', data: req, thread: thread })
    }

  } catch (error) {
    // console.log('Request Error: ', error.message)
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

      // console.log('Updated Thread: ', thread)


      const act = new Activity()
      act.cid = getCid()
      act.user = user._id
      act.text = 'You have sent a appoinment request'
      act.link = `/buyer/request_appoinment/${propertyId}`
      await act.save()

      const notify = new Notification()
      notify.cid = getCid()
      notify.user = developerId
      notify.text = `<strong>${user.first_name} ${user.last_name}</strong> have sent you an appointment request.`
      notify.link = `/developer/messages?thread=${thread._id}`
      notify.icon = 'calendar'
      await notify.save()

      // console.log(property)

      res.json({ status: 'success', data: req, thread: thread })
    }

  } catch (error) {
    // console.log('Request Error: ', error.message)
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

      // console.log('Req Admin: ', req.admin, type)
      // console.log('Req User : ', user._id, type)

      // if (String(req.admin) == String(user._id)) {

      const neg = await Negotiation.findById(req.negotiation)

      // return console.log('Canceling negotiation: ',neg)

      if (type == 'cancel') {

        if (neg) {

          neg.status = 'cancelled'
          await neg.save()

        }

        req.status = 'cancelled'

        await req.save()

      }




      // console.log('Req Canceled: ', req)
      // }


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
    // console.log('Request Error: ', error.message)
    res.json({ status: 'error', msg: error.message })
  }
}

exports.acceptAppointment = async (req, res) => {
  const token = req.headers.authorization

  const { requestId,
    threadId } = req.body
  try {

    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const request = await Request.findById(requestId)
      const thread = await Thread.findById(threadId)
      const property = await Property.findById(request.property)

      // console.log('thread: ', thread)
      const buyer = user.dashboard == 'buyer' ? user._id : thread.members.find(mbr => mbr.toString() != user._id.toString())
      const receiver  = thread.members.find(mbr => mbr.toString() != user._id.toString())
      const receiverUser = await User.findById(receiver)

      // console.log('Buyer ID: ', buyer)

      const appointment = new Appointment()
      appointment.cid = getCid()
      appointment.members = thread.members
      appointment.buyer = buyer
      appointment.manager = property?.manager
      appointment.developer = property?.developer
      appointment.thread = property?.thread || threadId
      appointment.property = property?._id
      appointment.appointmentDate = request.meetingDate
      appointment.status = 'accepted'
      await appointment.save()

      request.status = 'accepted'
      await request.save()

      const notify = new Notification()
      notify.cid = getCid()
      notify.user = receiverUser._id
      notify.text = `<strong>${user.first_name} ${user.last_name}</strong> have accepted your appointment request.`
      notify.link = `/${receiverUser.dashboard}/messages?thread=${thread._id}`
      notify.icon = 'exchange'
      await notify.save()

      return res.json({ status: 'success', appointment: appointment })

    }

  } catch (error) {
    // console.log('Error: ', error.message)
    return res.json({ status: 'error', msg: error.message })
  }
}

exports.getAppointments = async (req, res) => {
  const token = req.headers.authorization

  try {

    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {
      const appointments = await Appointment.find({
        members: { $in: [user._id] }
      }).populate([
        {
          path:'members',
          model: 'User'
        },
        {
          path:'property',
          model: 'Property'
        }
      ])

      // console.log('appointments: ', appointments)
      return res.json({ status: 'success', appointments })
    }

  } catch (error) {
    // console.log('Error: ', error.message)
    return res.json({ status: 'error', msg: error.message })
  }
}