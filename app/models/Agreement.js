const mongoose = require('mongoose')

const AgreementSchema = mongoose.Schema({

    cid: {
        type: String
    },

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    process: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Process'
    },

    members: {
        type: Array
    },

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },

    files: {
        type: Array
    },

    signedFiles: {
        type: Array
    },

    agreementType: {
        type: String,
    },

    mobileOTP: {
        type: String,
        default: null
    },

    emailOTP: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: ['created','pending', 'done'],
        default: 'created'
    },

})

AgreementSchema.set('timestamps', true)

// AgreementSchema.plugin(random)

module.exports = mongoose.model('Agreement', AgreementSchema)