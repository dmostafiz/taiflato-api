var mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const getCid = require('../../../helpers/getCid');
const Invite = require('../../models/Invite');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const mailTransporter = require('../../../helpers/mailTransporter');

exports.sendInvitation = async (req, res) => {
    const token = req.headers.authorization

    const { email } = req.body

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        console.log(user)

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        const invitingUser = await User.findOne({ email: email })
        if (invitingUser) return res.json({ status: 'error', msg: 'The emaile address are already exists in our record. please try a different one.' })
      
        const invitingEmail = await Invite.findOne({ email: email })
        if (invitingEmail) return res.json({ status: 'error', msg: 'The emaile address are already exists in our record. please try a different one.' })

        const cUser = new User()
        cUser.uid = customAlphabet('1234567890', 6)()
        cUser.username = customAlphabet('1234567890abcdefghizklmnopqrst', 6)()
        cUser.email = email
        cUser.user_type = 'user'
        cUser.realestate_admin = user._id
        cUser.is_realestate_admin = false
        cUser.dashboard = 'developer'
        cUser.company = user.company
        cUser.avatar = 'https://i1.wp.com/worldvisionit.com/wp-content/uploads/2019/02/kisspng-computer-icons-avatar-male-super-b-5ac405d55a6662.3429953115227959893703.png?fit=512%2C512&ssl=1'
        await cUser.save()


        const secure_url_token = customAlphabet('1234567890abcdefghizklmnopqrst', 90)()

        const mail = await mailTransporter.sendMail({
            from: 'noreply@israpoly.com',
            to: cUser.email,
            subject: 'Accept invitation',
            // text: 'That was easy! we sending you mail for testing our application',
            template: 'invitation',
            context: {
                name: user.username,
                token: secure_url_token,
                email: cUser.email 
            }
        })

        const invite = new Invite()
        invite.cid = getCid()
        invite.sender = user._id
        invite.user = cUser._id
        invite.email = cUser.email
        invite.company = user.company
        invite.inviteType = 'account_manager'
        invite.secure_token = secure_url_token
        await invite.save()
        // return res.json({ message })

        // const email_code = customAlphabet('1234567890', 6)()


        return res.json({ status: 'success', invitation: invite })



    } catch (error) {
        console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }
}

exports.reSendInvitationLink = async (req, res) => {
    const token = req.headers.authorization

    const { inviteId } = req.body

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        // console.log(user)

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        const exsInvite = await Invite.findById(inviteId)

        if(exsInvite){

            const invData = exsInvite
            await exsInvite.delete()

            const secure_url_token = customAlphabet('1234567890abcdefghizklmnopqrst', 90)()

            console.log('Old Invitation: ', invData)

    
            const mail = await mailTransporter.sendMail({
                from: 'noreply@israpoly.com',
                to: invData.email,
                subject: 'Accept invitation',
                // text: 'That was easy! we sending you mail for testing our application',
                template: 'invitation',
                context: {
                    name: user.username,
                    token: secure_url_token,
                    email: invData.email 
                }
            })
    
            const invite = new Invite()
            invite.cid = getCid()
            invite.sender = user._id
            invite.user = invData.user
            invite.email = invData.email
            invite.company = user.company
            invite.inviteType = 'account_manager'
            invite.secure_token = secure_url_token
            await invite.save()

            console.log('New Invitation: ', invite)

            return res.json({ status: 'success', invitation: invite })
        }

        // return res.json({ message })

        // const email_code = customAlphabet('1234567890', 6)()





    } catch (error) {
        console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }
}


exports.getMyInvitation = async (req, res) => {
    const token = req.headers.authorization

    const { email } = req.body

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        console.log(user)

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        const invitations = await Invite.find({ sender: user._id })
            .sort({createdAt: -1})
            .populate([
 
                {
                    path: 'user',
                    Model: 'User',
                    select: { 'password': 0 },
                }

            ])

        return res.json({ status: 'success', invitations })



    } catch (error) {
        console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }
}

exports.getInvite = async (req, res) => {
    const {email, token} = req.body

    try {
       
        const invite = await Invite.findOne({'email': email, 'secure_token': token})
        .populate([{
            path: 'user',
            Model: 'User',
            options:{
                select:{'password' : 0}
            }
        }])

        console.log("Invite found: ", invite)

        res.json({status: 'success', invite})

    } catch (error) {
        console.log('Error: ', error.message)
        res.json({status: 'error', msg: error.message})
    }
}