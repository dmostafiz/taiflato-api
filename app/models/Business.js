const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({

    user:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },

    name: {
        type: String
    },

    owner_name: {
        type: String
    },

    registration_number: {
        type: String
    },

    tin: {
        type: String
    },

    logo: {
        type: String
    },

    country:{
        type: String
    },

    District:{
        type: String
    },

    city:{
        type: String
    },

    zip:{
        type: String
    },

    location:{
        type: String
    },

    email: {
        type: String
    },
    
    phone: {
        type: String
    },

    fax: {
        type: String,
    },
    avatar:{
        type: String
    }

})

profileSchema.set('timestamps', true)

module.exports = mongoose.model('Profile', profileSchema)