const mongoose = require('mongoose')

const propertySchema = mongoose.Schema({

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

    bedroom: {
        type: Number,
    },

    bathroom: {
        type: Number,
    },

    floor: {
        type: Number,
    },

    garageSize: {
        type: Number,
    },

    additionalDetails: [],

    features: [],

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

    saleStatus : {
       type: String
    },

    readyTime:{
        type: Number 
    },

    investPrice:{
        type: Number
    },

    description: {
        type: String,
    },

    nearby: [],

    image: {          
        type: mongoose.Schema.Types.ObjectId,
        ref:'File'
    },

    images: [
        {          
            type: mongoose.Schema.Types.ObjectId,
            ref:'File'
        }
    ],

    floorplanImage: {          
        type: mongoose.Schema.Types.ObjectId,
        ref:'File'
    },

    virtualTourLink:{
        type:String
    },

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
        enum:['pending','published', 'drafted', 'sold','declined'],
        default:'pending'
    },

    isHot: {
        type: Boolean,
        default: false
    },

    isTrending: {
        type: Boolean,
        default: false
    },

    rank: {
        type: Number,
        default: 0
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

propertySchema.set('timestamps', true)

// propertySchema.plugin(random)

module.exports = mongoose.model('Property', propertySchema)