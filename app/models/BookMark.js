const mongoose = require('mongoose')

const BookMarkSchema = mongoose.Schema({
    
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

BookMarkSchema.set('timestamps', true)

module.exports = mongoose.model('BookMark', BookMarkSchema)