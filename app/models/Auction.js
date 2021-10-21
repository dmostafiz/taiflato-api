const mongoose = require('mongoose')

const auctionSchema = mongoose.Schema({
    
    aid:{
      type:String
    },

    developer:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },

    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    propertyImage:{
        type: String
    },

    auctionPrice:{
        type: Number
    },
  
    expireAt:{
        type: Date
    },

    bids:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    }],

    status: {
        type: String,
        enum:['pending','running', 'cancelled','completed'],
        default:'running'
    },

    buyer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

auctionSchema.set('timestamps', true)

module.exports = mongoose.model('Auction', auctionSchema)