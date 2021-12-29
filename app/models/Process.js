const mongoose = require('mongoose')

const processSchema = mongoose.Schema({

    cid: {
        type: String
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

    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Threed'
    },

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    price: {
        type: Number
    },

    reservationAgreement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agreement'
    },

    finalAgreement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agreement'
    },

    //steps
    stepLawyer: {

        buyerStatus: {
            type: String,
            enum: ['pending', 'processing', 'done'],
            default: 'processing'
        },

        developerStatus: {
            type: String,
            enum: ['pending', 'processing', 'done'],
            default: 'processing'
        },

        buyerOwnLawyer: {
            type: Boolean
        },

        buyerPartnerLawyer: {
            type: Boolean
        },

        developerOwnLawyer:{
            type: Boolean
        },

        developerPartnerLawyer:{
            type: Boolean
        },

        title: {
            type: String,
            default: 'Consult a lawyer'
        }
        ,
        description: {
            type: String,
            default: 'Consult a lawyer as soon as possible: On the various topics that will help you in your decision making. Aspects related to taxation and tax planning, aspects related to the mortgage, consultation and preliminary examinations concerning the apartment and/or apartments on the agenda assistance in negotiations with the developer.'
        }


    },

    stepReservationContractSign: {
        buyerStatus: {
            type: String,
            enum: ['pending', 'processing', 'done'],
            default: 'processing'
        },

        developerStatus: {
            type: String,
            enum: ['pending', 'processing', 'done'],
            default: 'pending'
        },

        buyerFiles: [{
            type: String
        }],

        developerFiles: [{
            type: String
        }],

        title: {
            type: String,
            default: 'Reservation contract sign'
        },
        description: {
            type: String,
            default: 'Signature : You have found an apartment that suits you. Negotiate the terms of the transaction: The price, the payment terms, the delivery date, the furniture, the equipment of the apartment. The apartments are new and under construction so you can choose options, specific works, options. During the negotiation have a price to negotiate with all the elements.'
        }
    },

    stepReservationPayment: {

        buyerStatus: {
            type: String,
            enum: ['pending', 'processing', 'done'],
            default: 'pending'
        },

        developerStatus: {
            type: String,
            enum: ['pending', 'processing', 'done'],
            default: 'pending'
        },

        payment: {
            type: Number,
            default: 1000
        },

        paymentConfimation: {
            type: Boolean
        },

        title: {
            type: String,
            default: 'Reservation payment'
        },
        description: {
            type: String,
            default: 'Pay $1000 to researve the property. it will ensure you that the property will be booked for you.'
        }
    },
    // lawyer: {

    // },

    status: {
        type: String,
        enum: ['cancelled', 'processing', 'completed'],
        default: 'processing'
    },
})

processSchema.set('timestamps', true)

module.exports = mongoose.model('Process', processSchema)