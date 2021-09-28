const User = require('../../models/User')
const Profile = require('../../models/Profile')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const {check, validationResult } = require('express-validator');
var validator = require('validator');

exports.login = async (req, res) => {

    const {username, password} = req.body

    // return console.log({username, password})

    try {
        var user = null

        user = await User.findOne({ username:username })

        
        if(!user) user = await User.findOne({ email:username })
        
        // return console.log("DB user: ", user)

        if(!user) return res.json({status:'error', msg: "User not found."})

        const compare = await bcrypt.compare(password, user.password)

        if(!compare) return res.json({status:'error', msg:'Invalid Credentials'})

        if(user.user_type == 'admin'){
            user.dashboard = 'admin'
            await user.save()
        }

        const token = jwt.sign({id: user.id}, process.env.APP_SECRET, {expiresIn:'1d'})
        
        const userData = {
            _id:user._id, 
            uid:user.uid,
            userName:user.username, 
            email:user.email, 
            firstName: user.first_name, 
            lastName: user.last_name,  
            avatar: user.avatar, 
            type: user.user_type,
            dashboard: user.dashboard
        }
     
        res.status(201).json({isAuth:true, token, user:userData, msg: "Logged in successfully."})
        
    } catch (error) {
        res.status(400).json({ isAuth:false, msg: "Something went wrong. Please try again later."})
    }

}

exports.register_account = async (req, res) => {

    // console.log("from Server",req.body)

    // return res.send('ok')

    const {userType,userName, email, country, phone, firstName, lastName, password, passwordConfirmation} = req.body

    const allErrors = []

    if(validator.isEmpty(userName)) allErrors.push({ userName: "Username should not be empty." })
  
    if(!validator.isLength(userName,{min:5})) allErrors.push({ userName: "Username should must 5 char or long." })

    if(validator.isEmpty(email) )  allErrors.push({ email: "Email should not be empty" })
  
    if(!validator.isEmail(email) )  allErrors.push({ email: "Email should be a valid email address." })
    
    if(validator.isEmpty(country)) allErrors.push({ country: "Country should not be empty." })

    if(validator.isEmpty(phone)) allErrors.push({ phone: "Phone number should not be empty." })

    if(validator.isEmpty(firstName)) allErrors.push({ firstName: "First Name should not be empty." })

    if(validator.isEmpty(lastName)) allErrors.push({ lastName: "Last Name should not be empty." })

    // if(password != password_confirmation) allErrors.push({ password: "Password not matched." })
    if(!validator.equals(password, passwordConfirmation) ) allErrors.push({ password: "Password does not matched." })
    
    // res.status(422).json({errors:{password:"Password not matched."}})

    try {

        const checkUserByUsername = await User.findOne({username: userName})

        if(checkUserByUsername) allErrors.push({ userName: "Username has already been taken." })
 
        const checkUserByEmail = await User.findOne({email: email})

        if(checkUserByEmail) allErrors.push({ email: "Email has already been taken." })
        

        if(allErrors.length) return res.json({errors: allErrors})

        const salt = await bcrypt.genSalt(12)

        const encryptedPassword = await bcrypt.hash(password, salt)

        const date = Date.now().toString()
        const uid = date.substr(-6)

        console.log("User ID: ",uid)

        const user = new User()
        user.uid = uid
        user.username = userName
        user.email = email
        user.country = country
        user.phone = phone
        user.user_type = 'user'
        user.dashboard = userType
        user.first_name = firstName
        user.last_name = lastName
        user.password = encryptedPassword
        user.avatar = 'https://i1.wp.com/worldvisionit.com/wp-content/uploads/2019/02/kisspng-computer-icons-avatar-male-super-b-5ac405d55a6662.3429953115227959893703.png?fit=512%2C512&ssl=1'
        await user.save()

        // const token = jwt.sign({id: user.id}, process.env.APP_SECRET, {expiresIn:'1d'})
        
        res.status(201).json({status: 'success', userData:{_id:user._id}, msg: "Account created successfully."})


    } catch (error) {

        return res.json({status:'error', msg: error.message})

    }

}

exports.authorize = async (req, res) => {

    const token = req.headers.authorization
    // console.log("My Token ============= : ", token)
    try {
        
        const data = jwt.verify(token, process.env.APP_SECRET);

        const user = await User.findOne({_id: data.id})

        if(!user) return res.json({isAuth:false, msg: 'You are not authorized'})

        const {_id, username, email, user_type, dashboard,} = user;

        return res.json({isAuth:true, _id, username, email, type: user_type, dashboard})

    } catch (error) {
        return res.json({isAuth:false, msg: 'You are not authorized'})
    }


    // res.json(token)
}

exports.secure_user = async (req, res) => {

    const token = req.headers.authorization
    // console.log("My Token ============= : ", token)
    try {
        
        const data = jwt.verify(token, process.env.APP_SECRET);

        const user = await User.findOne({_id: data.id})

        if(!user) return res.json({isAuth:false, msg: 'You are not authorized'})

        const {_id, username, email, user_type, dashboard} = user;

        return res.json({isAuth:true, _id, username, email, type: user_type})

    } catch (error) {
        return res.json({isAuth:false, msg: 'You are not authorized'})
    }


    // res.json(token)
}

exports.switch_dashboard = async (req, res) => {

    const token = req.headers.authorization
    console.log("My Dashboard ============= : ", req.body)

    try {
        
        const data = jwt.verify(token, process.env.APP_SECRET);

        const user = await User.findOne({_id: data.id})

        if(!user) return res.json({switchDashboard:false})

        console.log(user.user_type)

        if(user.user_type != 'admin') return res.json({switchDashboard:false})

        user.dashboard = req.body.dashboard

        await user.save()

        return res.json({switchDashboard:true})

    } catch (error) {
        return res.json({isAuth:false, msg: 'You are not authorized'})
    }

}