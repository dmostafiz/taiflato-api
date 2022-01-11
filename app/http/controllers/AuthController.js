const User = require('../../models/User')
const Profile = require('../../models/Profile')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mailTransporter = require('../../../helpers/mailTransporter');

const { customAlphabet } =  require('nanoid')

// const {check, validationResult } = require('express-validator');
var validator = require('validator');
const Invite = require('../../models/Invite');
const Company = require('../../models/Company');
const getCid = require('../../../helpers/getCid');
const twilioClient = require('../../../helpers/twilioClient');

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

        const token = jwt.sign({
            id: user.id, 
            dashboard: user.dashboard,
            type: user.user_type,
            isAdmin: user.is_realestate_admin
        }, process.env.APP_SECRET, {expiresIn:'1d'})
        
        const userData = {
            _id:user._id, 
            uid:user.uid,
            userName:user.username, 
            email:user.email, 
            firstName: user.first_name, 
            lastName: user.last_name,  
            avatar: user.avatar, 
            type: user.user_type,
            dashboard: user.dashboard,
            isAdmin: user.is_realestate_admin
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

        const email_code = customAlphabet('1234567890', 6)()
        const secure_url_token = customAlphabet('1234567890abcdefghizklmnopqrst', 90)()

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
        user.secure_url_token = secure_url_token
        user.email_verify_code = email_code
        // user.phone_veryfy_code = null
        await user.save()

        if(userType == 'developer'){
            const company = new Company()
            company.cid = getCid()
            company.admin = user._id
            company.managers = [...company.managers, user._id]
            // company.
            
            await company.save()

            user.company = company._id
            await user.save()
        }

        if(userType == 'buyer'){
            const profile = new Profile()
            profile.user = user._id
            // profile.
            
            await profile.save()

            user.profile = profile._id
            await user.save()
        }

        try {

            const mail = await mailTransporter.sendMail({
                from: 'No Reply <no-reply@israpoly.com>',
                to: user.email,
                subject: 'Verify your email',
                // text: 'That was easy! we sending you mail for testing our application',
                template: 'verify_email',
                context: {
                    name:user.username,
                    code: email_code 
                }
            })
        } catch (error) {
             console.log('Mail Error: ', error.message)
        }

        res.json({status: 'success', userData:{_id:user._id, email:user.email, token:user.secure_url_token}, msg: "Account created successfully."})


    } catch (error) {

        console.log('Registration Error: ', error.message)
        return res.json({status:'error', msg: error.message})

    }

}


exports.register_account_manager = async (req, res) => {

    // console.log("from Server",req.body)

    // return res.send('ok')

    const {userName, email, firstName, lastName, password, passwordConfirmation} = req.body

    const allErrors = []

    if(validator.isEmpty(userName)) allErrors.push({ userName: "Username should not be empty." })
  
    if(!validator.isLength(userName,{min:5})) allErrors.push({ userName: "Username should must 5 char or long." })

    if(validator.isEmpty(email) )  allErrors.push({ email: "Email should not be empty" })
  
    if(!validator.isEmail(email) )  allErrors.push({ email: "Email should be a valid email address." })

    if(validator.isEmpty(firstName)) allErrors.push({ firstName: "First Name should not be empty." })

    if(validator.isEmpty(lastName)) allErrors.push({ lastName: "Last Name should not be empty." })

    // if(password != password_confirmation) allErrors.push({ password: "Password not matched." })
    if(!validator.equals(password, passwordConfirmation) ) allErrors.push({ password: "Password does not matched." })
    
    // res.status(422).json({errors:{password:"Password not matched."}})

    try {

        const user = await User.findOne({email: email})

        if(!user) allErrors.push({ userName: "No invitation found with this email." })
 
        if(allErrors.length) return res.json({errors: allErrors})

        const salt = await bcrypt.genSalt(12)

        const encryptedPassword = await bcrypt.hash(password, salt)

        const date = Date.now().toString()
        const uid = date.substr(-6)

        console.log("User ID: ",uid)

        const email_code = customAlphabet('1234567890', 6)()
        const secure_url_token = customAlphabet('1234567890abcdefghizklmnopqrst', 90)()

        user.uid = uid
        user.username = userName
        user.email = email
        // user.country = country
        // user.phone = phone
        // user.user_type = 'user'
        // user.dashboard = userType
        user.is_realestate_admin = false
        user.first_name = firstName
        user.last_name = lastName
        user.password = encryptedPassword
        user.secure_url_token = secure_url_token
        user.email_verify_code = email_code
        // user.phone_veryfy_code = null

        await user.save()

        await Invite.findOneAndRemove({user: user._id})
        
        try {
            const mail = await mailTransporter.sendMail({
                from: 'No Reply <no-reply@israpoly.com>',
                to: user.email,
                subject: 'Verify your email',
                // text: 'That was easy! we sending you mail for testing our application',
                template: 'verify_email',
                context: {
                    name:user.username,
                    code: email_code 
                }
            })
        } catch (error) {
             console.log('Mail Error: ', error.message)
        }
        // const token = jwt.sign({id: user.id}, process.env.APP_SECRET, {expiresIn:'1d'})
        
        res.json({status: 'success', userData:{_id:user._id, email:user.email, token:user.secure_url_token}, msg: "Account created successfully."})


    } catch (error) {

        console.log('Registration Error: ', error.message)
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

        const {_id, username, email, user_type, dashboard, is_realestate_admin} = user;

        return res.json({isAuth:true, _id, username, email, type: user_type, dashboard, token, is_realestate_admin})

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
    // console.log("My Dashboard ============= : ", req.body)

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

exports.get_social_user_login = async (req, res) => {

    const {email} = req.body

    try {
        var user = await User.findOne({ email:email })
    
        if(!user) return res.json({status:'error', msg: "It seems you are not registered."})

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
        res.status(400).json({ status:'error', isAuth:false, msg: "Something went wrong. Please try again later."})
    }

}

exports.get_user_for_email_verification = async (req, res) => {
    const {secureToken, userId, email} = req.body 

    try {

        const user = await User.findOne({
            'secure_url_token':secureToken, 
            '_id': userId, 
            'email': email,
            'email_verified': false,
        })
        
        if(!user) return res.json({status: 'error', msg: 'Invalid token not accepted'})

        res.json({status:'success',user})
        
    } catch (error) {
        res.status(400).json({ status:'error', isAuth:false, msg: "Something went wrong. Please try again later."})
    }
}

exports.get_user_for_update_info = async (req, res) => {
    const {token, userId, email} = req.body 

    try {

        const user = await User.findOne({
            'secure_url_token':token, 
            '_id': userId, 
            'email': email,
            'email_verified': true,
            'phone_verified': true,
        })
        // .populate([
        //     {
        //         path:'company',
        //         model: 'Company'
        //     }
        // ])
        
        if(!user) return res.json({status: 'error', msg: 'Invalid token not accepted'})

        res.json({status:'success',user})
        
    } catch (error) {
        res.status(400).json({ status:'error', isAuth:false, msg: "Something went wrong. Please try again later."})
    }
}


exports.get_user_for_phone_verification = async (req, res) => {
    const {secureToken, userId, email} = req.body 

    try {

        const user = await User.findOne({
            'secure_url_token':secureToken, 
            '_id': userId, 
            'email': email,
            'phone_verified': false,
        })
        
        if(!user) return res.json({status: 'error', msg: 'Invalid token not accepted'})

        res.json({status:'success',user})
        
    } catch (error) {
        res.status(400).json({ status:'error', isAuth:false, msg: "Something went wrong. Please try again later."})
    }
}


exports.verify_user_email = async (req, res) => {
    const {secureToken, userId, email, verifyCode} = req.body 

    try {

        const user = await User.findOne({
            'secure_url_token':secureToken, 
            '_id': userId, 
            'email': email, 
            'email_verified': false,
            'email_verify_code': verifyCode
        })
        
        if(!user) return res.json({status: 'error', msg: 'Invalid code submitted'})
 
        user.email_verified = true
        user.email_verify_code = "" 
        await user.save() 


        res.json({status:'success', msg: 'Email verification success'})
        
    } catch (error) {
        res.status(400).json({ status:'error', msg:'Invalid code submitted'})
    }
}


exports.submit_phone_for_verify = async (req, res) => {
    const {secureToken, userId, email, phone} = req.body 

    try {

        const user = await User.findOne({
            'secure_url_token':secureToken, 
            '_id': userId, 
            'email': email, 
            'phone_verified': false
        })
        
        if(!user) return res.json({status: 'error', msg: 'Invalid code submitted'})
 

        const phone_code = customAlphabet('1234567890', 6)()


        user.phone = phone
        user.phone_verify_code = phone_code
        await user.save() 

        const message = `Hello ${user.username}, \nYour phone verification code is ${phone_code}`

        // const twilio = require('twilio')
        // const client = new twilio(
        //     'AC40426886092f8bf411327d5f461684b7', 
        //     '84cf61bce3031ef25c872f6d8c618f1d'
        // );

        // const client = twilioClient
        try {

            const msg = await twilioClient.messages.create({
               body: message,
            //    from: '+13373586639',
               from: 'Israpoly',

               to: phone
             })

             if(msg) {
                console.log('Message Sent: ', msg.sid)
             }

            console.log('Verification message: ', message)

          
        } catch (error) {
            console.log('Message Error: ', error.message)
            console.log('Verification message: ', message)
            return res.json({ status:'error', msg:error.message})
            
        }


        // console.log('Verification message: ', message)

       
        res.json({status:'success', user})
        
    } catch (error) {
        console.log('Error: ', error.message)
        res.json({ status:'error', msg:'Invalid code submitted'})
    }
}

exports.submit_phone_verify_code = async (req, res) => {
    const {secureToken, userId, email, code} = req.body 

    try {

        const user = await User.findOne({
            'secure_url_token':secureToken, 
            '_id': userId, 
            'email': email, 
            'phone_verify_code': code,
            'phone_verified': false
        })
        
        if(!user) return res.json({status: 'error', msg: 'Invalid code submitted'})
 

        // const phone_code = customAlphabet('1234567890', 6)()


        // user.phone = phone
        user.phone_verify_code = ""
        user.phone_verified = true
        user.account_verified = true

        await user.save() 


        // const message = `Hello ${user.username}, \nYour phone verification code is ${phone_code}`

        // const twilio = require('twilio')
        // const client = new twilio(
        //     'AC40426886092f8bf411327d5f461684b7', 
        //     '84cf61bce3031ef25c872f6d8c618f1d'
        // );
        // try {

        //     const msg = await client.messages.create({
        //        body: message,
        //     //    from: '+13373586639',
        //        from: 'Israpoly',

        //        to: phone
        //      })

        //      if(msg) {
        //         console.log('Message Sent: ', msg.sid)
        //      }

        //     console.log('Verification message: ', message)

          
        // } catch (error) {
        //     console.log('Message Error: ', error.message)
        //     console.log('Verification message: ', message)
        //     return res.json({ status:'error', msg:error.message})
            
        // }

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
            dashboard: user.dashboard,
            isAdmin: user.is_realestate_admin
        }


        // console.log('Verification user: ', user)

        // res.status(201).json({isAuth:true, token, user:userData, msg: "Logged in successfully."})
       
        res.json({status:'success',isAuth:true, token, user, userData})
        
    } catch (error) {
        console.log('Error: ', error.message)
        res.json({ status:'error', msg:'Invalid code submitted'})
    }
}