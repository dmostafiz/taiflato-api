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

    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    },


    sendContractByDeveloper: {

        status: {
            type: String,
            enum: ['created', 'pending', 'done'],
            default: 'pending'
        },

        files: {
            type: Array
        }
    },


    
    contractValidateByBuyer: {

        status: {
            type: String,
            enum: ['created', 'pending', 'done'],
            default: 'created'
        }
    },


    contractSignedByBuyer: {

        status: {
            type: String,
            enum: ['created', 'pending', 'done'],
            default: 'created'
        },

        // signatureType:{
        //     type: String,
        //     enum: ['online', 'offline']
        // },

        // signature_request_id:{
        //     type: String
        // },

        // files: {
        //     type: Array
        // }
    },


    signedContractSendByBuyer: {

        status: {
            type: String,
            enum: ['created', 'pending', 'done'],
            default: 'created'
        },

        signedStatus: {
            type: Boolean,
            enum: [true, false],
            default: false
        },

        pin: {
            type:Number
        },

        signatureType:{
            type: String,
            enum: ['online', 'offline']
        },
        
        files: {
            type: Array
        },

        signature_request_id:{
            type: String
        }

    },


    buyerLawyerNegotiationFinalContract: {

        status: {
            type: String,
            enum: ['created', 'pending', 'done'],
            default: 'created'
        },

    },

    stepReservationContractSign: {
        buyerStatus: {
            type: String,
            enum: ['created', 'processing', 'done'],
            default: 'processing'
        },
        

        developerStatus: {
            type: String,
            enum: ['created', 'processing', 'done'],
            default: 'processing'
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
            enum: ['created', 'processing', 'done'],
            default: 'created'
        },

        developerStatus: {
            type: String,
            enum: ['created', 'processing', 'done'],
            default: 'created'
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