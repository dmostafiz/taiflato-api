const mongoose = require('mongoose')

const FloorSchema = mongoose.Schema({

    floorNo:{
       type: Number
    },

    image:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'File'
    },

    coordinates: [],

    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }],

    // building:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Project'
    // },

    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

FloorSchema.set('timestamps', true)

// FloorSchema.plugin(random)

module.exports = mongoose.model('Floor', FloorSchema)