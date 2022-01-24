const mongoose = require('mongoose')

const promotionSchema = mongoose.Schema({

    aid: {
        type: String
    },

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    propertyImage: {
        type: String
    },

    reducedPercent: {
        type: Number
    },

    promotionPrice: {
        type: Number
    },

    startAt: {
        type: Date
    },

    expireAt: {
        type: Date
    },

    // bids: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Bid'
    // }],

    isCompleted: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ['pending', 'running', 'cancelled', 'completed'],
        default: 'pending'
    },

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

promotionSchema.set('timestamps', true)

module.exports = mongoose.model('Promotion', promotionSchema)