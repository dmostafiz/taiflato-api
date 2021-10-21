const mongoose = require('mongoose')

const bidSchema = mongoose.Schema({

    developer:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },

    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    action:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction'
    },

    buyer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    price:{
        type: Number
    },

    text: {
        type: String
    },

    status: {
        type: String,
        enum:['pending','accepted'],
        default:'pending'
    }

})

bidSchema.set('timestamps', true)

module.exports = mongoose.model('Bid', bidSchema)