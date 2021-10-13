const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({

    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
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

    files:[{}],

    status: {
        type: String,
        enum:['seen','unseen'],
        default:'unseen'
    },

})

MessageSchema.set('timestamps', true)

module.exports = mongoose.model('Message', MessageSchema)