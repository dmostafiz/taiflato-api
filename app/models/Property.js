const mongoose = require('mongoose')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const propertySchema = mongoose.Schema({

    pid: {
        type: String
    },

    serialNo: {
        type: String
    },

    title: {
        type: String
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

    finalPrice: {
        type: Number,
    },

    bedroom: {
        type: Number,
    },

    rooms: {
        type: Number,
    },

    bathroom: {
        type: Number,
    },

    floor: {
        type: Number,
    },

    additionalDetails: [],

    features: [],

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

    readyTime: {
        type: Number
    },

    description: {
        type: String,
    },

    nearby: [],

    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },

    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }
    ],


    virtualTourLink: {
        type: String
    },

    tags: [
        {
            type: String
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
        enum: ['pending', 'published', 'drafted', 'sold', 'declined'],
        default: 'pending'
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

    isPromoted: {
        type: Boolean,
        default: false
    },

    isAuctioned: {
        type: Boolean,
        default: false
    },

    auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction'
    },

    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion'
    },

    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }],


    soldTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

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

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

    balcony: {
        type: Number,
        default: 0
    },

    terrace: {
        type: Number,
        default: 0
    },

    garden: {
        type: Number,
        default: 0
    },

    loggia: {
        type: Number,
        default: 0
    },

    isUpdated: {
        type: Boolean,
        default: false
    },

    homePageSelected: {
        type: Boolean,
        default: false
    }
})

propertySchema.set('timestamps', true)
propertySchema.plugin(aggregatePaginate);
// propertySchema.plugin(random)

module.exports = mongoose.model('Property', propertySchema)