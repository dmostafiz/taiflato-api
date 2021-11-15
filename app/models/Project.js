const mongoose = require('mongoose')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ProjectSchema = mongoose.Schema({

    pid: {
        type: String
    },

    expert: {},
    lawyer: {},
    legals: {},

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

    buildingMedia:{},

    twoRoomApartment:{},
    threeRoomApartment:{},
    fourRoomApartment:{},
    fiveRoomApartment:{},
    office:{},
    store:{},

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
            ref: 'User'
        }
    ],
})

ProjectSchema.set('timestamps', true)
ProjectSchema.plugin(aggregatePaginate);
// ProjectSchema.plugin(random)

module.exports = mongoose.model('Project', ProjectSchema)