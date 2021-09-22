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
        enum:['pending','publish', 'draft', 'sold'],
        default:'pending'
    },

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

propertySchema.set('timestamps', true)

// propertySchema.plugin(random)

module.exports = mongoose.model('Property', propertySchema)