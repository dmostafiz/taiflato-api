const Profile = require("../../models/Profile")
const User = require("../../models/User")
const jwt = require('jsonwebtoken');
const BuyerProfile = require("../../models/BuyerProfile");

exports.update_user_profile_data = async (req, res) => {

  const token = req.headers.authorization
  console.log('Server Token:', token)

  const {
    birthDate,
    age,
    gender,
    marital_status,
    address,
    city,
    country,
    zip,
    income,
    want_credit,
    purchase_time
  } = req.body



  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const profile = await Profile.findOne({ _id: user.profile })

      if (profile) {

        profile.birthDate = birthDate
        profile.age = age
        profile.gender = gender
        profile.marital_status = marital_status
        profile.address = address
        profile.city = city
        profile.country = country
        profile.zip = zip
        profile.income = income
        profile.want_credit = want_credit
        profile.purchase_time = purchase_time

        await profile.save()

        console.log('Profile: ', profile)

        res.json({ status: 'success', profile })
      }

    }

  } catch (error) {
    res.json({ status: 'error', msg: error.message })
  }
}


exports.get_buyer_profile = async (req, res) => {
  const token = req.headers.authorization
  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const profile = await BuyerProfile.findOne({ user: user._id })

      if (profile) {
        res.json({ status: 'success', profile })
      }
      else {
        const cProfile = new BuyerProfile()
        cProfile.user = user._id
        await cProfile.save()

        user.buyerProfile = cProfile._id
        await user.save()

        res.json({ status: 'success', profile: cProfile })

      }
    }

  } catch (error) {
    console.log('Error: ', error.message)
    res.json({ status: 'error', msg: error.message })
  }
}


exports.save_buyer_profile = async (req, res) => {


  const token = req.headers.authorization
  console.log('Server Token:', token)

  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    country,
    address,
    city,
    street,
    phoneNumber,
    email,
    placeOfResidence,
    taxableIncome,
    maritalSituation,
    shareWithSpouse,
    spouseFirstName,
    spouseLastName,
    spouseEmailAddress,
    spousePhoneNumber,
    identityType,
    idNumber,
    spouseAccess,
    buyPropertyToLiveIn,
    buyPropertyToRentIt,
    investRealestate,
    buyingCity,
    wideOrCitySearch,
    buyToLiveImmediately,
    buyNewOrOld,
    timeToByOffPlan,
    buyingPeriod,
    typeOfProject,
    yourProject,
    buyAmount,
    needBankLoan,
    annualIncome,
    getInTouchWithLoanConsultant,
    haveOwnLawyer,
    lawyerFirstName,
    lawyerLastName,
    lawyerAddress,
    lawyerStreet,
    lawyerCity,
    lawyerZipCode,
    lawyerEmail,
    lawyerPhoneNumber,
    letUsAskToContactLawyer
  } = req.body



  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      let profile

      profile = await BuyerProfile.findOne({ user: user._id })

      if (!profile) {
        profile = new BuyerProfile()
      }

      if (profile) {
        
        profile.firstName = firstName
        profile.lastName = lastName
        profile.dateOfBirth = dateOfBirth
        profile.gender = gender
        profile.country = country
        profile.address = address
        profile.city = city
        profile.street = street
        profile.phoneNumber = phoneNumber
        profile.email = email
        profile.placeOfResidence = placeOfResidence
        profile.taxableIncome = taxableIncome
        profile.maritalSituation = maritalSituation
        profile.shareWithSpouse = shareWithSpouse
        profile.spouseFirstName = spouseFirstName
        profile.spouseLastName = spouseLastName
        profile.spouseEmailAddress = spouseEmailAddress
        profile.spousePhoneNumber = spousePhoneNumber
        profile.identityType = identityType
        profile.idNumber = idNumber
        profile.spouseAccess = spouseAccess
        profile.buyPropertyToLiveIn = buyPropertyToLiveIn
        profile.buyPropertyToRentIt = buyPropertyToRentIt
        profile.investRealestate = investRealestate
        profile.buyingCity = buyingCity
        profile.wideOrCitySearch = wideOrCitySearch
        profile.buyToLiveImmediately = buyToLiveImmediately
        profile.buyNewOrOld = buyNewOrOld
        profile.timeToByOffPlan = timeToByOffPlan
        profile.buyingPeriod = buyingPeriod
        profile.typeOfProject = typeOfProject
        profile.yourProject = yourProject
        profile.buyAmount = buyAmount
        profile.needBankLoan = needBankLoan
        profile.annualIncome = annualIncome
        profile.getInTouchWithLoanConsultant = getInTouchWithLoanConsultant
        profile.haveOwnLawyer = haveOwnLawyer
        profile.lawyerFirstName = lawyerFirstName
        profile.lawyerLastName = lawyerLastName
        profile.lawyerAddress = lawyerAddress
        profile.lawyerStreet = lawyerStreet
        profile.lawyerCity = lawyerCity
        profile.lawyerZipCode = lawyerZipCode
        profile.lawyerEmail = lawyerEmail
        profile.lawyerPhoneNumber = lawyerPhoneNumber
        profile.letUsAskToContactLawyer = letUsAskToContactLawyer

        await profile.save()

        console.log('Profile: ', profile)

        res.json({ status: 'success', profile })
      }

    }

  } catch (error) {
    res.json({ status: 'error', msg: error.message })
  }
}


