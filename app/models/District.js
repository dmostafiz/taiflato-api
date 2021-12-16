const mongoose = require('mongoose')

const DistrictSchema = mongoose.Schema({

    name:{
        type:String,
        // required:true
    },

    totatProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Project'
    }],

    totalSurface: {
        type: Number
    },

    surfaceSales: {
        type: Number
    },
    
    status:{
        type:String,
        enum:['active', 'inactive'],
        default: 'active'
    },

})

DistrictSchema.set('timestamps', true)

module.exports = mongoose.model('District', DistrictSchema)