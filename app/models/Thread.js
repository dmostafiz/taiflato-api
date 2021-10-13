const mongoose = require('mongoose')

const ThreadSchema = mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    messages:[]

})

ThreadSchema.set('timestamps', true)

module.exports = mongoose.model('Thread', ThreadSchema)