const jwt = require('jsonwebtoken')
const Negotiation = require('../../models/Negotiation')
// import negotiations from './../../../../src/pages/admin/negotiations';
const getCid = require('../../../helpers/getCid')
const Process = require('../../models/Process')
const ProcessStep = require('../../models/ProcessStep')
const Property = require('../../models/Property')
const Request = require('../../models/Request')
const Thread = require('../../models/Thread')
const User = require('../../models/User')
const mongoose = require('mongoose')
const Notification = require('../../models/Notification')
const Agreement = require('../../models/Agreement')

exports.createPurchaseProcess = async (req, res) => {

    const token = req.headers.authorization

    const { price,
        requestId,
        threadId,
        negotiationId } = req.body
    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const request = await Request.findById(requestId)
            const thread = await Thread.findById(threadId)
            const property = await Property.findById(request.property)
            const negot = await Negotiation.findById(negotiationId)

            const buyer = user.dashboard == 'buyer' ? user._id : request.members.find(mbr => mbr.toString() != user._id.toString())

            console.log('Buyer ID: ', buyer)

            const process = new Process()
            process.cid = getCid()
            process.members = request.members
            process.buyer = buyer
            process.manager = property.manager
            process.developer = property.developer
            process.thread = thread._id
            process.property = property._id
            process.price = negot.price
            await process.save()


            // steps.map(async (stp, index) => {

            //     const step = new ProcessStep()
            //     step.process = process._id
            //     step.buyer = buyer
            //     step.developer = property.developer
            //     step.manager = property.manager
            //     step.property = property._id
            //     step.stepTitle = stp.step
            //     step.status = index == 0 ? 'processing': 'pending',
            //     await step.save()
            // }) 

            request.status = 'accepted'
            await request.save()

            negot.status = 'accepted'
            await negot.save()

            const findReceiverId = request.members.find(mbr=> mbr.toString() != user._id.toString())
            const findReceiver = await User.findById(findReceiverId)

           if(findReceiver){
               const notify = new Notification()
               notify.cid = getCid()
               notify.user = findReceiver._id
               notify.text = `<strong>${user.first_name} ${user.last_name}</strong> have accepted your offer.`
               notify.link = `/${findReceiver.dashboard}/process/${process._id}?thread=${process.thread}`
               notify.icon = 'check'
               await notify.save()
           }

            return res.json({ status: 'success', process: process })

        }

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }

}

exports.get_secured_process = async (req, res) => {
    const token = req.headers.authorization

    const { processId } = req.body

    console.log('processId: ', processId)

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const propertyProcess = await Process.findOne({
                _id: processId,
                members: { $in: [user._id] }
            }).populate([
                {
                    path: 'property',
                    model: 'Property',
                    populate: [{
                        path: 'image',
                        model: 'File'
                    },
                    {
                        path: 'project',
                        model: 'Project'
                    }
                    ]
                }
            ])



            res.json({ status: 'success', propertyProcess })
        }

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.get_my_property_process = async (req, res) => {

    const token = req.headers.authorization

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const processProperties = await Process.find({
                // _id: processId,
                members: { $in: [user._id] }
            }).populate([
                {
                    path: 'property',
                    model: 'Property',
                    populate: [{
                        path: 'image',
                        model: 'File'
                    },
                    {
                        path: 'project',
                        model: 'Project'
                    }
                    ]
                }
            ])

            console.log('Process: ', processProperties)

            res.json({ status: 'success', processProperties })
        }

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}


exports.get_reservation_agreement = async (req, res) => {

    const token = req.headers.authorization

    const {processId, agreementType} = req.body

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const prc = await Process.findById( processId )

            console.log('Agreement process: ', prc)

            const agreement = await Agreement.findOne({
                process: prc._id,
                agreementType: agreementType
            })


            console.log('Agreement: ', agreement )

            res.json({ status: 'success', agreement:  agreement})
        }

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.create_sale_agreement = async (req, res) => {

    const token = req.headers.authorization

    const {processId, agreementType, agreementFiles} = req.body

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const prc = await Process.findById( processId ).populate([
                {
                    path:'property',
                    model: 'Property'
                }
            ])

            console.log('Agreement process: ', prc)

            const getAgreement = await Agreement.findOne({
                process: prc._id,
                agreementType: 'reservation'
            })

            const agreement = getAgreement ? getAgreement : new Agreement()
            agreement.cid = getCid()
            agreement.property = prc.property._id 
            agreement.process = prc._id 
            agreement.members = prc.members 
            agreement.buyer = prc.buyer
            agreement.manager = prc.manager
            agreement.developer = prc.developer 
            agreement.company = prc.property.company  
            agreement.files = agreementFiles
            agreement.agreentType = agreementType
            agreement.agreentType = agreementType 
            agreement.save()

            console.log('Process: ', prc )
            res.json({ status: 'success', agreement:  agreement})
        }

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}



exports.save_buyer_consult_lawyer_process = async (req, res) => {

    const token = req.headers.authorization

    const {processId,ownLawyer, partnerLawyer} = req.body

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const prc = await Process.findById( processId )
            prc.stepLawyer.buyerOwnLawyer = ownLawyer 
            prc.stepLawyer.buyerPartnerLawyer = partnerLawyer
            prc.stepLawyer.buyerStatus = 'done'
            prc.stepReservationContractSign.buyerStatus = 'processing' 
            await prc.save() 

            console.log('Process: ', prc )

            res.json({ status: 'success', processProperty:  prc})
        }

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.save_developer_consult_lawyer_process = async (req, res) => {

    const token = req.headers.authorization

    const {processId,ownLawyer, partnerLawyer} = req.body

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const prc = await Process.findById( processId )
            prc.stepLawyer.developerOwnLawyer = ownLawyer 
            prc.stepLawyer.developerPartnerLawyer = partnerLawyer
            prc.stepLawyer.developerStatus = 'done'
            prc.stepReservationContractSign.developerStatus = 'processing' 
            await prc.save() 

            console.log('Process: ', prc )

            res.json({ status: 'success', processProperty:  prc})
        }

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

