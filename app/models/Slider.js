const mongoose = require('mongoose')

const SliderSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

    image:{
        type:String
    },

    videoLink:{
        type:String
    },

    status:{
        type:String,
        enum:['property', 'project', 'banner'],
        default: 'active'
    },

    status:{
        type:String,
        enum:['active', 'inactive'],
        default: 'active'
    },

    hasButton:{
        type:Boolean,
        default:false
    },

    buttonText:{
        type:String
    },

    buttonLink:{
        type:String
    },

    buttonBgColor:{
        type:String
    },

    buttonTextColor:{
        type:String
    },
})

SliderSchema.set('timestamps', true)

module.exports = mongoose.model('Slider', SliderSchema)