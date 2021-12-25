const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
    user:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },

    birthDate: {
        type: Date
    },

    gender: {
        type: String
    },

    marital_status: {
        type: String,
    },

    address: {
        type: String
    },

    city: {
        type: String
    },

    country: {
        type: String
    },

    zip: {
        type: String,
    },

    taxable_income: {
        type: String,
    },

    income: {
        type: String,
    },
    purchase_time: {
        type: String,
    },
    want_credit: {
        type: Boolean,
    }
})

profileSchema.set('timestamps', true)

module.exports = mongoose.model('Profile', profileSchema)