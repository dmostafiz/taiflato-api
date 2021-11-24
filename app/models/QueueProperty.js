const mongoose = require('mongoose')

const QueuePropertySchema = mongoose.Schema({

    propertyType: {type: String},

    numberOfRooms:{
        type: Number
    },

    numberOfBathrooms:{
        type: Number
    },

    propertySize:{
        type: Number
    },

    price:{
        type: Number
    },

    total:{
        type: Number
    },

    virtualTour:{
        type: String
    },

    videoLink:{
        type: String
    },

    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },

    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    started: {
       type: Boolean,
       default: false
    }

})

QueuePropertySchema.set('timestamps', true)

module.exports = mongoose.model('QueueProperty', QueuePropertySchema)