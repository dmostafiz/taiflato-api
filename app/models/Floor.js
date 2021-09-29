const mongoose = require('mongoose')

const FloorSchema = mongoose.Schema({

    floorNo:{
       type: String
    },

    properties: [
        {   
            property: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Property',
            },
            
            status: {
                type: String,
                enum:['available','unavailable'],
                default:'available'
            },

            coords: String,

            propertyNo: String
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