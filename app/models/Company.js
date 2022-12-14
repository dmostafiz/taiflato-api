const mongoose = require('mongoose')

const CompanySchema = mongoose.Schema({

    cid:{
        type: Number
    },

    logo: {
        type: String
    },

    name: {
        type: String
    },

    contact: {
        type: String
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

    zipCode: {
        type: String
    },


    businessEmail: {
        type: String
    },

    businessPhone: {
        type: String
    },
    
    projectCompleted:{
        type: Number
    },

    companyCreatedAt:{
        type: Date
    },

    regNumber: {
        type: String
    },

    companyType:{
        type: String
    },

    numberOfEmployees:{
        type: Number
    },

    turnoverLastyear:{
        type: Number
    },

    constructionsNumber:{
        type: Number
    },

    founderName:{
        type: String
    },

    ceoName:{
        type: String
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },

    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'  
    }],

    negotiations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'  
    }],


    sales: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'  
    }],

    status: {
        type: String,
        enum:['pending','approved'],
        default:'pending'
    },

})

CompanySchema.set('timestamps', true)

module.exports = mongoose.model('Company', CompanySchema)