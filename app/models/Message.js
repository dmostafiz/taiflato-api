const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({

    cid:{
        type: Number
    },

    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    },

    members: {
        type: Array
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    text:{
        type: String
    },

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    },

    negotiation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negotiation'
    },

    price:{
        type: Number
    },

    files:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],

    meetingDate:{
        type: Date
    },

    type:{
        type:String,
        enum:['text', 'file', 'image', 'buy', 'offer', 'meet'],
        default: 'text'
    },

    status: {
        type: String,
        enum:['seen','unseen'],
        default:'unseen'
    },

})

MessageSchema.set('timestamps', true)

module.exports = mongoose.model('Message', MessageSchema)