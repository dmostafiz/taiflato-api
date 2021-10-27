const mongoose = require('mongoose')

const promotionSchema = mongoose.Schema({
    
    pid:{
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

    promotionPrice:{
        type: Number
    },
  
    expireAt:{
        type: Date
    },

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

promotionSchema.set('timestamps', true)

module.exports = mongoose.model('Promotion', promotionSchema)