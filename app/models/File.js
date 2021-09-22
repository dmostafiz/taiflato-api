const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
    bucket:{
        type: String,
    },
    eTag:{
        type: String,
    },
    key:{
        type: String
    },
    location:{
        type: String,
    },
    versionId:{
        type: String,
    },

    mime:{
        type: String,
    },

    fileExt:{
        type: String,
    },

    fileType:{
        type: String,
    },

    folder:{
        type: String,
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

fileSchema.set('timestamps', true)

module.exports = mongoose.model('File', fileSchema)