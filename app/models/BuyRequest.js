const mongoose = require('mongoose')

const buyRequestSchema = mongoose.Schema({

    cid:{
        type: String,
    },

    buyer:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },

    developer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    coverLetter: {
        type: String,
    },

    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],

    price:{
        type: Number
    },

    status:{
        type:String,
        enum:['pending', 'accepted', 'declined'],
        default: 'pending'
    },

})

buyRequestSchema.set('timestamps', true)

module.exports = mongoose.model('BuyRequest', buyRequestSchema)