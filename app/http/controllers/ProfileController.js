const Profile = require("../../models/Profile")
const User = require("../../models/User")
const jwt = require('jsonwebtoken');

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
  
        const profile = await Profile.findOne({_id: user.profile})
  
        if(profile){
            
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

            res.json({status: 'success', profile})
        }
  
      }
  
    } catch (error) {
        res.json({status:'error', msg:error.message})
    }
}
