const mongoose = require('mongoose')

const SliderSchema = mongoose.Schema({

    name:{
        type:String,
        // required:true
    },

    title:{
        type:String,
        // required:true
    },

    description:{
        type:String,
        // required:true
    },

    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

    background: {
        type: String, 
    },

    image:{
        type:String
    },

    videoLink:{
        type:String
    },

    sliderType:{
        type:String,
        enum:['property', 'project', 'custom'],
        default: 'project'
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