const mongoose = require('mongoose')

const processStepSchema = mongoose.Schema({
    
    process:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Process'
    },

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

    stepTitle: {
        type:String
    },

    stepDescription:{
        type:String
    },

    buyerFiles:[],
    developerFiles:[],
    
    status: {
        type: String,
        enum:['pending', 'processing', 'completed'],
        default:'pending'
    },
})

processStepSchema.set('timestamps', true)

module.exports = mongoose.model('ProcessStep', processStepSchema)