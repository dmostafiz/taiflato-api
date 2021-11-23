const mongoose = require('mongoose')

const QueueUploadSchema = mongoose.Schema({

    buffer: {
        type: Buffer
    },

    type: {},

    fileName: {
        type: String
    },

    folder: {
        type: String
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    uploadFor:{
        type: String // profile, project, messages, 
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

    propertyType: {type: String},

    started: {
       type: Boolean,
       default: false
    }

})

QueueUploadSchema.set('timestamps', true)

module.exports = mongoose.model('QueueUpload', QueueUploadSchema)