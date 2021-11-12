const mongoose = require('mongoose')

const BuildingSchema = mongoose.Schema({

    pid:{
       type: String
    },

    title: {
        type: String,
        required: true,
    },

    propertyType: {
        type: String,
    },

    propertySize: {
        type: Number,
    },

    price: {
        type: Number,
    },

    country:{
        type: String
    },

    district:{
        type: String
    },

    city:{
        type: String
    },

    zip:{
        type: String
    },

    address:{
        type: String
    },

    latitude:{
        type: String
    },

    longitude:{
        type: String
    },

    buildingStartTime:{
        type: Date 
    },

    buildingReadyTime:{
        type: Date 
    },

    description: {
        type: String,
    },

    buildingImage: {          
        type: mongoose.Schema.Types.ObjectId,
        ref:'File'
    },

    imgDimensions:{},

    galleryImages: [
        {          
            type: mongoose.Schema.Types.ObjectId,
            ref:'File'
        }
    ],

    floors: [
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref:'Floor'
        }
    ],


    tags: [
        {
            type:String
        }
    ],

    metaTitle: {
        type: String
    },

    metaDescription: {
        type: String
    },

    keywords: [
        {
            type: String
        }
    ],

    status: {
        type: String,
        enum:['pending','published', 'drafted','declined'],
        default:'pending'
    },


    reviews:[
        {
           uid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
           },

           text:{
               type:String,
           },

           rating:{
               type: Number
           }
        }
    ],

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

BuildingSchema.set('timestamps', true)

// BuildingSchema.plugin(random)

module.exports = mongoose.model('Building', BuildingSchema)