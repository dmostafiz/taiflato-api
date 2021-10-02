const mongoose = require('mongoose')

const apartmentSchema = mongoose.Schema({

    apartmentNo:{
       type: String
    },

    coordinates: [],

    property: {   
        type: mongoose.Schema.Types.ObjectId,
        ref:'Property'
    },

    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

    status:{
        type: String,
        enum:['available','unavailable', 'booked'],
        default:'available'
    },

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

apartmentSchema.set('timestamps', true)

// apartmentSchema.plugin(random)

module.exports = mongoose.model('Apartment', apartmentSchema)