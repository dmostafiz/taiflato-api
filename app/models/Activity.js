const mongoose = require('mongoose')

const activitySchema = mongoose.Schema({
    
    cid:{
        type: Number
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    text:{
      type: String
    },

    link:{
      type: String
    }, 

    linkText: {
      type: String,
      default: 'View details'
    },
     
})

activitySchema.set('timestamps', true)

module.exports = mongoose.model('Activity', activitySchema)