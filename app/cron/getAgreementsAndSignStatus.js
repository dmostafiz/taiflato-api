const getCid = require('../../helpers/getCid');
const twilioClient = require('../../helpers/twilioClient');
const Agreement = require('../models/Agreement');
const Notification = require('../models/Notification');
const Process = require('../models/Process');
const User = require('../models/User');
const hellosign = require('hellosign-sdk')({ key: '89c6d48bbc1f8d2f2894bb6080ae31d57095ea3440349b0fef284f224b4948c7' });

function getAgreementsAndSignStatus(cron){

    cron.schedule('0 0-59 * * * *', async () => {

        async function getAgreement(){
            const agreement = await Agreement.findOne({agreementStatus: 'pending'})
            
            if(agreement){

                console.log("Pending agreement from cron: ", agreement)
             
                const res = await hellosign.signatureRequest.get(agreement.signature_request_id)

                
                console.log('Agreement Signers: ', res)
                
                if(res.signature_request.is_complete == true){
                    
                    const process = await Process.findById(agreement.process)
                    process.stepReservationContractSign.buyerStatus = 'done'
                    process.stepReservationContractSign.developerStatus = 'done'
                    
                    process.stepReservationPayment.buyerStatus = 'processing'
                    process.stepReservationPayment.developerStatus = 'processing'
                    
                    await process.save()
                    
                    agreement.agreementStatus = 'done'
                    await agreement.save()


                    const signers = res.signature_request.signatures

                    console.log('Cron signatures: ', signers)

                    const user1 = await User.findOne({email: signers[0].signer_email_address})
                    console.log('Cron signer 1: ', user1)

                    if(user1){
                        const notify = new Notification()
                        notify.cid = getCid()
                        notify.user = user1._id
                        notify.text = `Property reservation agreement signature completed`
                        notify.link = `/${user1.dashboard}/process/${process._id}?thread=${process.thread}`
                        notify.icon = 'check'
                        await notify.save()

                        await twilioClient.messages.create({
                            body: `Property reservation agreement signature completed.`,
                            //    from: '+13373586639',
                            from: 'Israpoly',
                            to: user1.phone
                        })
            
                    }

                    const user2 = await User.findOne({email: signers[1].signer_email_address})
                    console.log('Cron signer 2: ', user2)

                    if(user2){

                        const notify2 = new Notification()
                        notify2.cid = getCid()
                        notify2.user = user2._id
                        notify2.text = `Property reservation agreement signature completed`
                        notify2.link = `/${user2.dashboard}/process/${process._id}?thread=${process.thread}`
                        notify2.icon = 'check'
                        await notify2.save() 
                        
                        await twilioClient.messages.create({
                            body: `Property reservation agreement signature completed.`,
                            //    from: '+13373586639',
                            from: 'Israpoly',
                            to: user2.phone
                        })
            
                    }

                }


                console.log("Cronde agreement sign status: ", res.signature_request)
            }

        }

        await getAgreement()

    });

}

module.exports = getAgreementsAndSignStatus