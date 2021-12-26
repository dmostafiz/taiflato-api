const mongoose = require('mongoose')

const CompareSchema = mongoose.Schema({
    
    cid:{
      type:String
    },

    user:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },

    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }

})

CompareSchema.set('timestamps', true)

module.exports = mongoose.model('Compare', CompareSchema)