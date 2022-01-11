const Company = require("../../models/Company")
const User = require("../../models/User")
const jwt = require('jsonwebtoken');

exports.getCompanyByUserId = async (req, res) => {
    const {userId} = req.body

    try {

        const company = await Company.findOne({admin: userId})

        return res.json({status: 'success', company})
        
    } catch (error) {
        // console.log('Error: ', error.message)
        res.json({status: 'error', msg: error.message})
    }
}

exports.update_user_company_data = async (req, res) => {


    console.log("Property Data: ", req.body)
  
    const token = req.headers.authorization
    console.log('Server Token:', token)
  
    const {
        companyId,
        name, 
        contact, 
        address, 
        city, 
        zipCode, 
        projectCompleted, 
        companyCreatedAt, 
        regNumber, 
        companyType, 
        numberOfEmployees, 
        turnoverLastyear, 
        founderName, 
        ceoName,
        businessEmail, 
        businessPhone, 
        country
    } = req.body

  
  
    try {
      const data = jwt.verify(token, process.env.APP_SECRET)
  
      const user = await User.findOne({ _id: data.id })
  
      if (user) {
  
        const company = await Company.findOne({_id: companyId, admin: user._id})
  
        if(company){
            
            company.name = name
            company.contact = contact
            company.address = address
            company.city = city
            company.zipCode = zipCode
            company.projectCompleted = projectCompleted
            company.companyCreatedAt = companyCreatedAt
            company.regNumber = regNumber
            company.companyType = companyType
            company.numberOfEmployees = numberOfEmployees
            company.turnoverLastyear = turnoverLastyear
            company.founderName = founderName
            company.ceoName = ceoName
            company.businessEmail = businessEmail
            company.businessPhone = businessPhone 
            company.country = country

            await company.save()

            // console.log('Company: ', company)

            res.json({status: 'success', company})
        }
  
      }
  
    } catch (error) {
        res.json({status:'error', msg:error.message})
    }
}

exports.get_managers_by_company_admin = async (req, res) => {
    const id = req.params.adminId

    // console.log('Params: ', req.params)

    try {

        const user = await User.findOne({_id: id, is_realestate_admin: true})

        // console.log('Manager Admin: ', user)

        if(user){
            
            const managers = await User.find({company: user.company, is_realestate_admin: false, account_verified: true})

            return res.json({status: 'success', managers})
        }

        return res.json({status: 'error', msg:'Eror occured'})

        
    } catch (error) {
        // console.log('Error: ', error.message)
        res.json({status: 'error', msg: error.message})
    }
}
