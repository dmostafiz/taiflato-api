const mongoose = require('mongoose')

const ThreadSchema = mongoose.Schema({

    cid:{
        type: Number
    },
    
    members: {
       type: Array
    },
  
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'  
    }],

    newMessages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'  
    }],

    status: {
        type: String,
        enum:['seen','unseen'],
        default:'unseen'
    },

})

ThreadSchema.set('timestamps', true)

module.exports = mongoose.model('Thread', ThreadSchema)