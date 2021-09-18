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
    image:{
        type:String
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
    buttonName:{
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