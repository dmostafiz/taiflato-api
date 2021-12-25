const mongoose = require('mongoose')

const BuyerProfileSchema = mongoose.Schema({

    user:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },

    firstName:{
        type:String
    },

    lastName:{
        type:String
    },

    dateOfBirth:{
        type:Date
    },

    gender:{
        type:String
    },

    country:{
        type:String
    },

    address:{
        type:String
    },

    city:{
        type:String
    },

    street:{
        type:String
    },

    phoneNumber:{
        type:String
    },

    email:{
        type:String
    },

    placeOfResidence:{
        type:String
    },

    taxableIncome:{
        type:String
    },

    maritalSituation:{
        type:String
    },

    shareWithSpouse:{
        type:String
    },

    spouseFirstName:{
        type:String
    },

    spouseLastName:{
        type:String
    },

    spouseEmailAddress:{
        type:String
    },

    spousePhoneNumber:{
        type:String
    },

    identityType:{
        type:String
    },

    idNumber:{
        type:String
    },

    spouseAccess:{
        type:Boolean,
        default: false
    },

    buyPropertyToLiveIn:{
        type:Boolean,
        default: false
    },

    buyPropertyToRentIt:{
        type:Boolean,
        default: false
    },

    investRealestate:{
        type:Boolean,
        default: false
    },

    buyingCity:{
        type:String
    },

    wideOrCitySearch:{
        type:String
    },

    buyToLiveImmediately:{
        type:Boolean,
        default: false
    },

    buyNewOrOld:{
        type:String
    },

    timeToByOffPlan:{
        type:String
    },

    buyingPeriod:{
        type:String
    },

    typeOfProject:{
        type:String
    },

    yourProject:{
        type:String
    },

    buyAmount:{
        type:Number
    },

    needBankLoan:{
        type:Boolean,
        default: false
    },

    annualIncome:{
        type:String
    },

    getInTouchWithLoanConsultant:{
        type:Boolean,
        default: false
    },

    haveOwnLawyer:{
        type:Boolean,
        default: false
    },

    lawyerFirstName:{
        type:String
    },

    lawyerLastName:{
        type:String
    },

    lawyerAddress:{
        type:String
    },

    lawyerStreet:{
        type:String
    },

    lawyerCity:{
        type:String
    },

    lawyerZipCode:{
        type:String
    },

    lawyerEmail:{
        type:String
    },

    lawyerPhoneNumber:{
        type:String
    },

    letUsAskToContactLawyer:{
        type:Boolean,
        default: false
    }

})

BuyerProfileSchema.set('timestamps', true)

module.exports = mongoose.model('BuyerProfile', BuyerProfileSchema)