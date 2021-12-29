const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({

  cid: {
    type: String
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  text: {
    type: String
  },

  link: {
    type: String
  },

  linkText: {
    type: String,
    default: 'View details'
  },

  icon: {
    type: String,
    enum: ['bell', 'envelope', 'completed', 'comment', 'money', 'file', 'check', 'calendar', 'bullhorn', 'exchange', 'video-camera'],
    default: 'bell'
  },

  status: {
    type: String,
    enum: ['seen', 'unseen'],
    default: 'unseen'
  },


})

notificationSchema.set('timestamps', true)

module.exports = mongoose.model('Notification', notificationSchema)