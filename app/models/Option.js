const mongoose = require('mongoose')

const OptionSchema = mongoose.Schema({

    slider: {
       type: Boolean,
       default: true
    },
  


})

OptionSchema.set('timestamps', true)

module.exports = mongoose.model('Option', OptionSchema)