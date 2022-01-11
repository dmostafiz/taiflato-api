var mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const getCid = require('../../../helpers/getCid');
const Invite = require('../../models/Invite');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const LoanApplication = require('../../models/LoanApplication');

exports.getUserLoanApplication = async (req, res) => {
    const token = req.headers.authorization
    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    // const { email } = req.body
    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        // console.log(user)

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        const loanApp = await LoanApplication.findOne({ user: user._id })

        return res.json({ status: 'success', loanApply: loanApp })

    } catch (error) {
        // console.log('Error: ', error.message)
        res.json({ status: 'error', msg: error.message })
    }
}

exports.saveUserLoanApplication = async (req, res) => {
    const token = req.headers.authorization
    const {
        typeOfApplication,
        applicationData,
        name,
        idNumber,
        dateOfBirth,
        occupation,
        seniority,
        income,
        phoneNumber,
        emailAddress,
        propertyRental,
        socialSecurity,
        otherAdditionalIncome,
        rentPayment,
        mortgageMonthlyPayment,
        liabilityRentPaymentBalance,
        liabilityLoan,
        liabilityRepayment,
        liabilityLoanBalance,
        liabilityTermination,
        yearsOfMarriage,
        numOfChildren,
        numOfFatherCablings,
        numOfMotherCablings,
        militaryService,
        women,
        calculationPoints,
        loanAmount,
        propertyAddresses,
        valueOfProperty,
        listedIn,
        requestLoanAmount,
        whichConsitutes,
        percentageOfPropertyValue,
        additionalPropertyAddresses,
        additionalValueOfProperty,
        additionalListedIn,
        estimatedMonthlyRePayment,
        remarks

    } = req.body

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    // const { email } = req.body
    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        // console.log(user)

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        let loanApp = await LoanApplication.findOne({ user: user._id })

        if (!loanApp) {
            loanApp = new LoanApplication()
        }

        loanApp.cid = getCid(),
            loanApp.user = user._id,
            loanApp.typeOfApplication = typeOfApplication,
            loanApp.applicationData = applicationData,
            loanApp.name = name,
            loanApp.idNumber = idNumber,
            loanApp.dateOfBirth = dateOfBirth,
            loanApp.occupation = occupation,
            loanApp.seniority = seniority,
            loanApp.income = income,
            loanApp.phoneNumber = phoneNumber,
            loanApp.emailAddress = emailAddress,
            loanApp.propertyRental = propertyRental,
            loanApp.socialSecurity = socialSecurity,
            loanApp.otherAdditionalIncome = otherAdditionalIncome,
            loanApp.rentPayment = rentPayment,
            loanApp.mortgageMonthlyPayment = mortgageMonthlyPayment,
            loanApp.liabilityRentPaymentBalance = liabilityRentPaymentBalance,
            loanApp.liabilityLoan = liabilityLoan,
            loanApp.liabilityRepayment = liabilityRepayment,
            loanApp.liabilityLoanBalance = liabilityLoanBalance,
            loanApp.liabilityTermination = liabilityTermination,
            loanApp.yearsOfMarriage = yearsOfMarriage,
            loanApp.numOfChildren = numOfChildren,
            loanApp.numOfFatherCablings = numOfFatherCablings,
            loanApp.numOfMotherCablings = numOfMotherCablings,
            loanApp.militaryService = militaryService,
            loanApp.women = women,
            loanApp.calculationPoints = calculationPoints,
            loanApp.loanAmount = loanAmount,
            loanApp.propertyAddresses = propertyAddresses,
            loanApp.valueOfProperty = valueOfProperty,
            loanApp.listedIn = listedIn,
            loanApp.requestLoanAmount = requestLoanAmount,
            loanApp.whichConsitutes = whichConsitutes,
            loanApp.percentageOfPropertyValue = percentageOfPropertyValue,
            loanApp.additionalPropertyAddresses = additionalPropertyAddresses,
            loanApp.additionalValueOfProperty = additionalValueOfProperty,
            loanApp.additionalListedIn = additionalListedIn,

            loanApp.estimatedMonthlyRePayment = estimatedMonthlyRePayment,

            loanApp.remarks = remarks

        loanApp.status = 'pending'

        await loanApp.save()

        return res.json({ status: 'success', loanApply: loanApp })

    } catch (error) {
        // console.log('Error: ', error.message)
        res.json({ status: 'error', msg: error.message })
    }

}

exports.get_pending_loan_profiles = async (req, res) => {
    try {

        const loanProfiles = await LoanApplication.find({ status: 'pending' })
            .populate([
                {
                    path: 'user',
                    model: 'User'
                }
            ])


        return res.json({ status: 'success', loanProfiles })

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.get_approved_loan_profiles = async (req, res) => {
    try {

        const loanProfiles = await LoanApplication.find({ status: 'approved' })
            .populate([
                {
                    path: 'user',
                    model: 'User',
                    populate: [
                        {
                            path:'buyerProfile',
                            model: 'BuyerProfile'
                        }
                    ]
                }
            ])

        return res.json({ status: 'success', loanProfiles })

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.get_user_loan_profile = async (req, res) => {

    const loanId = req.params.loanId

    try {

        const loanProfile = await LoanApplication.findById(loanId)
            .populate([
                {
                    path: 'user',
                    model: 'User',
                    populate: [
                        {
                            path:'buyerProfile',
                            model: 'BuyerProfile'
                        }
                    ]
                }
            ])

        return res.json({ status: 'success', loanProfile })

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}



exports.change_loan_status = async (req, res) => {

    const token = req.headers.authorization

    const {status,loanId} = req.body

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    // const { email } = req.body
    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        // console.log(user)

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })
        if (user && user.dashboard != 'admin') return res.json({ status: 'error', msg: 'Your are not authorised' })

        const loanProfile = await LoanApplication.findById(loanId)

        loanProfile.status = status 
        await loanProfile.save()

        return res.json({ status: 'success', loanProfile })

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}
