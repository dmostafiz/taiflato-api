const mongoose = require('mongoose')

const NegotiationSchema = mongoose.Schema({

    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    developer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    manager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    buyer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    request:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    },

    message: {
        type: String
    },

    price: {
        type: Number
    },

    status:{
        type: String,
        enum:['accpeted', 'cancelled', 'pending'],
        default: 'pending'
    },



})

NegotiationSchema.set('timestamps', true)

module.exports = mongoose.model('Negotiation', NegotiationSchema)