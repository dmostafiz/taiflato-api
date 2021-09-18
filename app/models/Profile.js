const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
    user:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    street_address: {
        type: String
    },
    city: {
        type: String
    },

    state: {
        type: String
    },
    
    country: {
        type: String
    },
    zip: {
        type: String,
    },
    avatar:{
        type: String
    }

})

profileSchema.set('timestamps', true)

module.exports = mongoose.model('Profile', profileSchema)