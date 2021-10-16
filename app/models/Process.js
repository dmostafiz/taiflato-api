const mongoose = require('mongoose')

const processSchema = mongoose.Schema({

    buyer:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },

    developer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    steps:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProcessStep'
        }
    ],

    status: {
        type: String,
        enum:['cancelled', 'processing', 'completed'],
        default:'processing'
    },
})

processSchema.set('timestamps', true)

module.exports = mongoose.model('Process', processSchema)