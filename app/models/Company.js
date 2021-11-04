const mongoose = require('mongoose')

const CompanySchema = mongoose.Schema({

    cid:{
        type: Number
    },

    name: {
        type: String
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'  
    }],
   
    buildings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building'  
    }],

    status: {
        type: String,
        enum:['pending','approved'],
        default:'pending'
    },

})

CompanySchema.set('timestamps', true)

module.exports = mongoose.model('Company', CompanySchema)