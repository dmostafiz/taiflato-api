const jwt = require('jsonwebtoken')
const getCid = require('../../../helpers/getCid')
const Message = require('../../models/Message')
const Thread = require('../../models/Thread')
const User = require("../../models/User")
var mongoose = require('mongoose');

exports.getMyThreadById = async (req, res) => {

  const token = req.headers.authorization
  const { threadId } = req.body

  if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


    const thread = await Thread.findOne({ '_id': threadId })

      .populate([
        {
          path: 'members',
          model: 'User',
          select: { 'password': 0 },
        },

        {
          path: 'messages',
          model: 'Message',
          options: {
            sort: { 'createdAt': -1 }
          }
        }
      ])
      .sort({ 'updatedAt': -1 })
    // console.log('My Thread: ', thread)

    return res.json({ thread })



  } catch (error) {
    console.log('Error: ', error)
    return res.json({ status: 'error', msg: 'Your are not authorised' })
  }
}

exports.getMyThreads = async (req, res) => {
  const token = req.headers.authorization

  if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


    const threads = await Thread.find({
      members: { $in: [user._id] }
      // $or: [
      //   { 'sender': user._id },
      //   { 'receiver': user._id },
      // ]
    })

      .populate([
        {
          path: 'members',
          model: 'User',
          select: { 'password': 0 },
        },
        // {
        //   path: 'receiver',
        //   model: 'User',
        //   select: { 'password': 0 },
        // },
        {
          path: 'messages',
          model: 'Message',
          options: {
            sort: { 'createdAt': -1 }
          }
        }
      ])
      .sort({ 'updatedAt': -1 })

    // console.log('My Threads: ', threads)

    return res.json({ threads })



  } catch (error) {
    console.log('Error: ', error)
    return res.json({ status: 'error', msg: 'Your are not authorised' })
  }

}

exports.getThreadMessages = async (req, res) => {

  const id = req.params.id

  const token = req.headers.authorization

  if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


    const thread = await Thread.findOne({
      '_id': id
      // $or: [
      //   { 'sender': user._id },
      //   { 'receiver': user._id },
      // ],
      // $and: [
      //   { '_id': id }
      // ]
    })

    // .populate([
    //   {
    //     path: 'sender',
    //     model: 'User',
    //     select: { 'password': 0 },
    //   },
    //   {
    //     path: 'receiver',
    //     model: 'User',
    //     select: { 'password': 0 },
    //   },
    //   {
    //     path: 'messages',
    //     model: 'Message',
    //     options: {
    //       sort: { 'createdAt': -1 }
    //     }
    //   }
    // ])

    if (thread) {

      thread.newMessages = []
      await thread.save()

      const messages = await Message.find({ 'thread': thread._id })
        // .sort({'createdAt': -1})
        // .limit(20)
        .skip(Message.collection.count() - 20)
        .populate([
          // {
          //   path: 'members',
          //   model: 'User',
          //   select: { 'password': 0 },
          // },
          {
            path: 'sender',
            model: 'User',
            select: { 'password': 0 },
          },
          {
            path: 'property',
            model: 'Property',
            populate: {
              path: 'image',
              Model: 'File'
            }
          },
          {
            path: 'request',
            model: 'Request',
          },
          {
            path: 'negotiation',
            model: 'Negotiation',
          },
          {
            path: 'files',
            model: 'File',
            // options: {
            //   sort: { 'createdAt': -1 }
            // }
          }
        ])

      // console.log('Thread Messages: ', messages)


      return res.json({ messages: messages, thread: thread })

    }
    else {
      return res.json({ status: 'error', msg: 'Invalid thread returned' })

    }


  } catch (error) {
    console.log('Error: ', error)
    return res.json({ status: 'error', msg: 'Your are not authorised' })
  }


}

exports.sendMessage = async (req, res) => {

  const token = req.headers.authorization

  const { text, threadId } = req.body

  if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


    const thread = await Thread.findById(threadId)

      .populate([
        {
          path: 'members',
          model: 'User',
          select: { 'password': 0 },
        },
        {
          path: 'messages',
          model: 'Message',
          options: {
            sort: { 'createdAt': -1 }
          }
        }

      ])

    console.log('My Threads: ', thread)

    if (thread) {
      const msg = new Message()
      msg.thread = threadId
      msg.sender = user._id
      msg.text = text
      await msg.save()

      thread.messages = [...thread.messages, msg]
      thread.newMessages = [...thread.newMessages, msg]
      await thread.save()

      const message = await Message.findById(msg._id)
        .populate([
          {
            path: 'sender',
            model: 'User',
            select: { 'password': 0 },
          },

          {
            path: 'property',
            model: 'Property',
            populate: {
              path: 'image',
              Model: 'File'
            }
          },
          {
            path: 'files',
            model: 'File',
            // options: {
            //   sort: { 'createdAt': -1 }
            // }
          }
        ])

      return res.json({ message })
    }





  } catch (error) {
    console.log('Error: ', error)
    return res.json({ status: 'error', msg: 'Your are not authorised' })
  }
}

exports.get_thread_or_create = async (req, res) => {

  const token = req.headers.authorization

  const { receiverId } = req.body

  if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

    const receiver = await User.findById(receiverId)

    if (receiver) {

      const existedThread = await Thread.findOne({
        members: { $in: [mongoose.Types.ObjectId(user._id)] },
        $and: [
          {
            // members:{ $in: [mongoose.Types.ObjectId(user._id)]},  
            members: { $in: [mongoose.Types.ObjectId(receiver._id)] }
          }
        ]

      })

      const thread = existedThread ? existedThread : new Thread()

      if (!existedThread) {
        thread.cid = getCid()
        thread.members = [
          mongoose.Types.ObjectId(user._id),
          mongoose.Types.ObjectId(receiver._id)
        ]
        await thread.save()
      }

      const messages = await Message.find({thread: thread._id})

      if(!messages.length){
        const msg = new Message()
        msg.cid = getCid()
        msg.thread = thread._id
        msg.sender = user._id
        msg.receiver = receiver._id
        msg.text = `Hello ${receiver.username}!`
        // msg.meetingDate = appoinmentDate
        // msg.property = propertyId
        // msg.request = req._id
        msg.type = 'text'
        await msg.save()
  
        thread.messages = [...thread.messages, msg._id]
        thread.newMessages = [...thread.newMessages, msg._id]
        await thread.save()
      }

      return res.json({ status: 'success', thread})

    }


  } catch (error) {
    console.log('Error: ', error)
    return res.json({ status: 'error', msg: 'Your are not authorised' })
  }
}