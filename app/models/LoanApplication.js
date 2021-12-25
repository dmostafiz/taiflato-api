const mongoose = require('mongoose')

const LoanApplicationSchema = mongoose.Schema({

    cid:{
        type: Number
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },

    typeOfApplication: {
        type: String,
    },

    applicationData: {
        type: String,
    },

    name: {
        type: String,
    },

    idNumber: {
        type: String,
    },

    dateOfBirth: {
        type: Date,
    },

    occupation: {
        type: String,
    },

    seniority: {
        type: String,
    },

    income: {
        type: String,
    },

    phoneNumber: {
        type: String,
    },

    emailAddress: {
        type: String,
    },

    propertyRental: {
        type: String,
    },

    socialSecurity: {
        type: String,
    },

    otherAdditionalIncome: {
        type: String,
    },

    rentPayment: {
        type: String,
    },

    mortgageMonthlyPayment: {
        type: String,
    },

    liabilityRentPaymentBalance: {
        type: String,
    },

    liabilityLoan: {
        type: String,
    },

    liabilityRepayment: {
        type: String,
    },

    liabilityLoanBalance: {
        type: String,
    },

    liabilityTermination: {
        type: String,
    },

    yearsOfMarriage: {
        type: String,
    },

    numOfChildren: {
        type: String,
    },

    numOfFatherCablings: {
        type: String,
    },

    numOfMotherCablings: {
        type: String,
    },

    militaryService: {
        type: String,
    },

    women: {
        type: String,
    },

    calculationPoints: {
        type: String,
    },

    loanAmount: {
        type: String,
    },

    propertyAddresses: {
        type: String,
    },

    valueOfProperty: {
        type: String,
    },

    listedIn: {
        type: String,
    },

    requestLoanAmount: {
        type: String,
    },

    whichConsitutes: {
        type: String,
    },

    percentageOfPropertyValue: {
        type: String,
    },

    additionalPropertyAddresses: {
        type: String,
    },

    additionalValueOfProperty: {
        type: String,
    },

    additionalListedIn: {
        type: String,
    },

    estimatedMonthlyRePayment: {
        type: String,
    },

    remarks: {
        type: String,
    },

    status: {
        type: String,
        enum:['pending','approved', 'declined'],
        default:'pending'
    },

})

LoanApplicationSchema.set('timestamps', true)

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema)