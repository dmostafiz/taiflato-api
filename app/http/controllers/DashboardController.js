const Activity = require("../../models/Activity")
const jwt = require('jsonwebtoken')
const User = require("../../models/User")

exports.getMyActivities = async (req, res) => {
    const token = req.headers.authorization

    console.log('My Token: ', token)

    if(!token) return res.json({status:'error', msg: 'Your are not authorised'})
 
    try {
         const data = jwt.verify(token, process.env.APP_SECRET)
         
         const user = await User.findOne({ _id: data.id }) 
 
         if(!user) return res.json({status:'error', msg: 'Your are not authorised'})
         
         
         const activities = await Activity.find({user: user._id}).limit(8).sort({'createdAt': -1}) 

         console.log('Activities: ', activities.length)
         return res.json(activities)
 
      
 
 
    } catch (error) {
         console.log('Error: ', error)
         return res.json({status:'error', msg: 'Your are not authorised'})
    }
 
}


exports.get_my_managers = async (req, res) => {
     const token = req.headers.authorization
 
     console.log('My Token: ', token)
 
     if(!token) return res.json({status:'error', msg: 'Your are not authorised'})
  
     try {
          const data = jwt.verify(token, process.env.APP_SECRET)
          
          const user = await User.findOne({ _id: data.id }) 
  
          if(!user) return res.json({status:'error', msg: 'Your are not authorised'})
          
          
          const managers = await User.find({realestate_admin: user._id, account_verified: true}) 
 
          console.log('Managers: ', managers)
          return res.json({managers:managers})
  

  
     } catch (error) {
          console.log('Error: ', error)
          return res.json({status:'error', msg: 'Your are not authorised'})
     }
  
 }