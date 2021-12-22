const mongoose = require('mongoose')

const RequestSchema = mongoose.Schema({

    cid: {
        type: String,
    },

    members: {
        type: Array
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    negotiation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negotiation'
    },

    coverLetter: {
        type: String,
    },

    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],

    request_type: {
        type: String,
        enum: ['buy', 'offer', 'meet'],
        default: 'buy'
    },

    // price:{
    //     type: Number
    // },

    meetingDate: {
        type: Date
    },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'cancelled'],
        default: 'pending'
    },

})

RequestSchema.set('timestamps', true)

module.exports = mongoose.model('Request', RequestSchema)