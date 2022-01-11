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
const twilioClient = require('../../../helpers/twilioClient')
const fs = require('fs');


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

            // console.log('Buyer ID: ', buyer)

            const process = new Process()
            process.cid = getCid()
            process.members = request.members
            process.buyer = buyer
            process.manager = property.manager
            process.developer = property.developer
            process.thread = thread._id
            process.property = property._id
            process.price = negot.price
            process.request = request._id
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

            const findReceiverId = request.members.find(mbr => mbr.toString() != user._id.toString())
            const findReceiver = await User.findById(findReceiverId)

            if (findReceiver) {
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
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }

}

exports.get_secured_process = async (req, res) => {
    const token = req.headers.authorization

    const { processId } = req.body

    // console.log('processId: ', processId)

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
        // console.log('Error: ', error.message)
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

            // console.log('Process: ', processProperties)

            res.json({ status: 'success', processProperties })
        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.get_reservation_agreement = async (req, res) => {

    const token = req.headers.authorization

    const { processId, agreementType } = req.body

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const prc = await Process.findById(processId)

            // console.log('Agreement process: ', prc)

            const agreement = await Agreement.findOne({
                process: prc._id,
                agreementType: agreementType
            })


            // console.log('Agreement: ', agreement)

            res.json({ status: 'success', agreement: agreement })
        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}


exports.get_process_negotiations = async (req, res) => {

    const token = req.headers.authorization

    const { processId } = req.body

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const prc = await Process.findById(processId)

            // console.log('Current Process: ', prc)

            if(prc){
               
                const negots = await Negotiation.find({request: prc.request}).populate([
                    {
                        path: 'admin',
                        Model: 'User'
                    }
                ])
                .sort({createdAt: -1})

                // console.log('Process Negotiations: ', negots)
                res.json({ status: 'success', negotiations: negots })
            }



        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}


exports.send_contract_to_buyer = async (req, res) => {

    const token = req.headers.authorization

    const { processId, agreementFiles } = req.body


    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const pprocess = await Process.findById(processId).populate([
                {
                    path: 'property',
                    model: 'Property'
                }
            ])

            pprocess.sendContractByDeveloper.files = agreementFiles
            pprocess.sendContractByDeveloper.status = 'done'

            
            pprocess.contractValidateByBuyer.status = 'pending'
            await pprocess.save()
            // console.log('Agreement process: ', prc)

            // const getAgreement = await Agreement.findOne({
            //     process: prc._id,
            //     agreementType: 'reservation'
            // })

            // const buyerPin = getCid(6)
            // const developerPin = getCid(6)

            // const agreement = getAgreement ? getAgreement : new Agreement()
            // agreement.cid = getCid()
            // agreement.property = prc.property._id
            // agreement.process = prc._id
            // agreement.members = prc.members
            // agreement.buyer = prc.buyer
            // agreement.manager = prc.manager
            // agreement.developer = prc.developer
            // agreement.company = prc.property.company
            // agreement.files = agreementFiles
            // agreement.agreementType = agreementType
            // agreement.developerSecretPin = developerPin
            // agreement.buyerSecretPin = buyerPin
            // agreement.agreementStatus = 'pending'
            // await agreement.save()

            // const hellosign = require('hellosign-sdk')({ key: '89c6d48bbc1f8d2f2894bb6080ae31d57095ea3440349b0fef284f224b4948c7' });

            // const buyer = await User.findById(agreement.buyer)

            // const signers = [
            //     {
            //         email_address: buyer.email,
            //         name: buyer.first_name + ' ' + buyer.last_name,
            //         signer_role: 'member',
            //         pin: buyerPin
            //     }
            // ]

            // console.log('Agreement files: ', agreement.files)

            // const opts = {
            //     test_mode: 1,
            //     clientId: '9c4ca4b559a1c03a1ca60a6f84a5f3c9',
            //     subject: 'Property reservation agreement',
            //     message: 'Check your phone for a secret pin to sign this document.',
            //     signers: signers,
            //     file_url: agreement.files
            // };

            // const signRes = await hellosign.signatureRequest.send(opts)

            // await twilioClient.messages.create({
            //     body: `Hello ${buyer.first_name} ${buyer.last_name},\nYour secret code is ${buyerPin}`,
            //     //    from: '+13373586639',
            //     from: 'Israpoly',
            //     to: buyer.phone
            // })

            // //   signRes.signature_request.signatures.forEach(async sgn => {

            // agreement.signature_request_id = signRes.signature_request.signature_request_id
            // await agreement.save()

            // console.log('Signature Agreement Response: ', signRes.signature_request)

            res.json({ status: 'success', process: pprocess })

        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.validate_contract_by_buyer = async (req, res) => {

    const token = req.headers.authorization

    const { processId } = req.body


    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const pprocess = await Process.findById(processId).populate([
                {
                    path: 'property',
                    model: 'Property'
                }
            ])

            pprocess.contractValidateByBuyer.status = 'done'
            pprocess.contractSignedByBuyer.status = 'pending'
            await pprocess.save()
  

            res.json({ status: 'success', process: pprocess })

        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.confirming_sign_by_buyer = async (req, res) => {

    const token = req.headers.authorization

    const { processId } = req.body


    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const pprocess = await Process.findById(processId).populate([
                {
                    path: 'property',
                    model: 'Property'
                }
            ])

            pprocess.contractSignedByBuyer.status = 'done'
            pprocess.signedContractSendByBuyer.status = 'pending'
            pprocess.signedContractSendByBuyer.status = 'pending'
            pprocess.signedContractSendByBuyer.pin = getCid(6)
            await pprocess.save()
  

            res.json({ status: 'success', process: pprocess })

        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}


exports.get_otp_on_mobile = async (req, res) => {

    const token = req.headers.authorization

    const { processId } = req.body

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {


            const pprocess = await Process.findById(processId).populate([
                {
                    path: 'property',
                    model: 'Property'
                }
            ])

            // console.log('Pin from process: ', pprocess)

            if (pprocess) {

                const pin = pprocess.signedContractSendByBuyer.pin

                const message = `Hello ${user.username}, \nYour contract signature secret pin is ${pin}`

                try {

                    const msg = await twilioClient.messages.create({
                        body: message,
                        //    from: '+13373586639',
                        from: 'Israpoly',
                        to: user.phone
                    })

                    if (msg) {
                        // console.log('Message Sent: ', msg.sid)
                    }

                    // console.log('Verification message: ', message)

                    // console.log('Process: ', process)

                    res.json({ status: 'success', msg: `Secret pin has been sent to ${user.phone}`, process: pprocess })


                } catch (error) {

                    // console.log('Message Error: ', error.message)
                    // console.log('Verification message: ', message)
                    return res.json({ status: 'error', msg: error.message })

                }
            }


        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}


exports.send_signed_document_by_buyer = async (req, res) => {

    const token = req.headers.authorization

    const { processId, signatureType, otp, signedFiles } = req.body


    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const pprocess = await Process.findById(processId).populate([
                {
                    path: 'property',
                    model: 'Property'
                }
            ])

            if(signatureType == 'offline'){
                if(!signedFiles.length) return res.json({status: 'error', msg: 'No signed file uploaded'})
                if(otp != pprocess.signedContractSendByBuyer.pin){
                    return res.json({status: 'otpError', msg: 'Invalid OTP'})
                }else{
                    pprocess.signedContractSendByBuyer.files = signedFiles
                    pprocess.signedContractSendByBuyer.signedStatus = true
                }
            }else if(signatureType == 'online'){


                const hellosign = require('hellosign-sdk')({ key: '89c6d48bbc1f8d2f2894bb6080ae31d57095ea3440349b0fef284f224b4948c7' });

                // const buyer = await User.findById(agreement.buyer)
    
                const sec_pin = pprocess.signedContractSendByBuyer.pin
    
                const signers = [
                    {
                        email_address: user.email,
                        name: user.first_name + ' ' + user.last_name,
                        signer_role: 'member',
                        pin: sec_pin
                    }
                ]
    
                // console.log('Agreement files: ', agreement.files)
    
                const opts = {
                    test_mode: 1,
                    clientId: '9c4ca4b559a1c03a1ca60a6f84a5f3c9',
                    subject: 'Property booking contract agreement',
                    message: 'Check your phone for the secret pin to sign this document.',
                    signers: signers,
                    file_url: pprocess.sendContractByDeveloper.files
                };
    
                const signRes = await hellosign.signatureRequest.send(opts)
    
                await twilioClient.messages.create({
                    body: `Hello ${user.first_name} ${user.last_name},\nYour secret code is ${sec_pin}`,
                    //    from: '+13373586639',
                    from: 'Israpoly',
                    to: user.phone
                })

                pprocess.signedContractSendByBuyer.signature_request_id =  signRes.signature_request.signature_request_id
                pprocess.signedContractSendByBuyer.signedStatus = true
            }

            pprocess.signedContractSendByBuyer.signatureType = signatureType
            await pprocess.save()
  

            res.json({ status: 'success', process: pprocess })

        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.developer_confirm_signature_done = async (req, res) => {

    const token = req.headers.authorization

    const { processId } = req.body


    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const pprocess = await Process.findById(processId).populate([
                {
                    path: 'property',
                    model: 'Property'
                }
            ])

            pprocess.signedContractSendByBuyer.status = 'done'
            pprocess.buyerLawyerNegotiationFinalContract.status = 'pending'
     
            await pprocess.save()
  

            res.json({ status: 'success', process: pprocess })

        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}



exports.download_signed_agreement = async (req, res) => {

    // const token = req.headers.authorization

    const { processId } = req.body

    try {

        // const data = jwt.verify(token, process.env.APP_SECRET)

        // const user = await User.findOne({ _id: data.id })

        // if (user) {

            // const prc = await Process.findById(processId)

            // console.log('Agreement process: ', prc)

            const pprocess = await Process.findById(processId)


            // console.log('Insomnia pprocess: ', pprocess)

            if(pprocess.signedContractSendByBuyer.signatureType == 'online'){
                const hellosign = require('hellosign-sdk')({ key: '89c6d48bbc1f8d2f2894bb6080ae31d57095ea3440349b0fef284f224b4948c7' });
    
                const dFile = await hellosign.signatureRequest.download( pprocess.signedContractSendByBuyer.signature_request_id, {
                    file_type: 'pdf',
                    get_url: true
                })
    
                // console.log('Download File Response: ', dFile)
                
                res.json({ status: 'success', process: pprocess, file_url: dFile.file_url })
            }
            else{

                res.json({ status: 'success', process: pprocess, file_url: pprocess.signedContractSendByBuyer.files[0] })
            }

            
            // file.on('finish', () => {
            //     file.close();
            // });
        // }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}



