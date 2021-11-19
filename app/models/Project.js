const mongoose = require('mongoose')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ProjectSchema = mongoose.Schema({

    cid: {
        type: String
    },

    expert:{
        first_name:{ type: String},
        last_name:{ type: String},
        address:{ type: String},
        email:{ type: String},
        phone:{ type: String},
        copies:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    lawyer: {
        first_name:{ type: String},
        last_name:{ type: String},
        address:{ type: String},
        email:{ type: String},
        phone:{ type: String},
        copies:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    legal: {
        copies:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    projectCode: {
        type: String,
    },

    projectTitle: {
        type: String,
    },

    numberOfBuildings: {
        type: Number,
    },

    numberOfFloors: {
        type: Number,
    },

    floors:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Floor'
    },

    heightOfBuilding: {
        type: Number,
    },

    surfaceOfBuilding: {
        type: Number,
    },

    parkingOfBuilding: {
        type: Number,
    },

    features: [],

    projectStartedDate: {
        type: Date
    },

    projectCompleteDate: {
        type: Date
    },

    deliveryIn: {
        type: Number
    },

    country: {
        type: String
    },

    district: {
        type: String
    },

    city: {
        type: String
    },

    zip: {
        type: String
    },

    address: {
        type: String
    },


    latitude: {
        type: String
    },

    longitude: {
        type: String
    },

    nearby: [],

    projectImage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },

    projectImages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],

    videoLink:{
        type: String
    },

    virtualTour:{
        type: String
    },

    projectMedia:{
        virtualTour:{type: String},
        videoLink:{type: String},
        image:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        images:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    twoRoomApartment:{
        total:{type: Number},
        price:{type: Number},
        surface:{type: Number},
        bathrooms:{type: Number},
        virtualTour:{type: String},
        videoLink:{type: String},
        image:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        images:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    threeRoomApartment:{
        total:{type: Number},
        price:{type: Number},
        surface:{type: Number},
        bathrooms:{type: Number},
        virtualTour:{type: String},
        videoLink:{type: String},
        image:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        images:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    fourRoomApartment:{
        total:{type: Number},
        price:{type: Number},
        surface:{type: Number},
        bathrooms:{type: Number},
        virtualTour:{type: String},
        videoLink:{type: String},
        image:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        images:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    fiveRoomApartment:{
        total:{type: Number},
        price:{type: Number},
        surface:{type: Number},
        bathrooms:{type: Number},
        virtualTour:{type: String},
        videoLink:{type: String},
        image:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        images:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    office:{
        total:{type: Number},
        price:{type: Number},
        surface:{type: Number},
        bathrooms:{type: Number},
        virtualTour:{type: String},
        videoLink:{type: String},
        image:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        images:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    store:{
        total:{type: Number},
        price:{type: Number},
        surface:{type: Number},
        bathrooms:{type: Number},
        virtualTour:{type: String},
        videoLink:{type: String},
        image:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        images:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    },

    description: {
        type: String,
    },

    reviews: [
        {
            uid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },

            text: {
                type: String,
            },

            rating: {
                type: Number
            }
        }
    ],


    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    properties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property'
        }
    ],

    note: {
        type: String,
    },

    status: {
        type: String,
        enum:['pending','published', 'drafted', 'declined'],
        default:'pending'
    },
})

ProjectSchema.set('timestamps', true)
ProjectSchema.plugin(aggregatePaginate);
// ProjectSchema.plugin(random)

module.exports = mongoose.model('Project', ProjectSchema)