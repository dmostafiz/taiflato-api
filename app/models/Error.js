const mongoose = require('mongoose')

const ErrorSchema = mongoose.Schema({

    cid:{
        type:String,
        // required:true
    },

    errorType: {
        type: String
    },

    errorMessage: {
        type: String
    }

})

ErrorSchema.set('timestamps', true)

module.exports = mongoose.model('Error', ErrorSchema)