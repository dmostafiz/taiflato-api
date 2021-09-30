const mongoose = require('mongoose')

const FloorSchema = mongoose.Schema({

    floorNo:{
       type: String
    },

    floorImage:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'File'
    },

    coordinates: [],

    properties: [
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref:'Property'
        }
    ],

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

FloorSchema.set('timestamps', true)

// FloorSchema.plugin(random)

module.exports = mongoose.model('Project', FloorSchema)