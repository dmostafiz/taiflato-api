const jwt = require('jsonwebtoken')
const { customAlphabet } = require('nanoid')
const getCid = require('../../../helpers/getCid')
const mailTransporter = require('../../../helpers/mailTransporter')
const Floor = require('../../models/Floor')
const Invite = require('../../models/Invite')
const Project = require('../../models/Project')
const User = require("../../models/User")

exports.get_my_managers = async (req, res) => {
    const token = req.headers.authorization

    console.log('My Token: ', token)

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


        const managers = await User.find({ realestate_admin: user._id, account_verified: true })

        console.log('Managers: ', managers)
        return res.json({ managers: managers })



    } catch (error) {
        console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }

}


exports.save_project = async (req, res) => {
    const token = req.headers.authorization

    const {
        selectManager,
        inviteManager,

        expert,
        lawyer,
        projectLegalCopies,
        managerEmail,
        projectCode,
        title,
        numberOfBuilding,
        numberOfFloor,
        heightOfBuilding,
        surfaceOfBuilding,
        parkingOfBuilding,
        features,
        projectStartedDate,
        projectCompleteDate,
        deliveryIn,
        country,
        district,
        city,
        zip,
        address,
        latitude,
        longitude,
        nearby,
        building,

        twoRoomApartment,
        threeRoomApartment,
        fourRoomApartment,
        fiveRoomApartment,
        office,
        store,

        description

    } = req.body

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        let manager = user

        if (selectManager) {
           
            manager = await User.findOne({ email: managerEmail, account_verified: true })

        } else if (inviteManager) {

            const invitingUser = await User.findOne({ email: managerEmail })

            if (!invitingUser) {

                const cUser = new User()
                cUser.uid = customAlphabet('1234567890', 6)()
                cUser.username = customAlphabet('1234567890abcdefghizklmnopqrst', 6)()
                cUser.email = managerEmail
                cUser.user_type = 'user'
                cUser.realestate_admin = user._id
                cUser.is_realestate_admin = false
                cUser.dashboard = 'developer'
                cUser.company = user.company
                cUser.avatar = 'https://i1.wp.com/worldvisionit.com/wp-content/uploads/2019/02/kisspng-computer-icons-avatar-male-super-b-5ac405d55a6662.3429953115227959893703.png?fit=512%2C512&ssl=1'
                await cUser.save()

                manager = cUser

                const invitingEmail = await Invite.findOne({ email: managerEmail })
                if (!invitingEmail) {

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

                }
            }
            else {
                manager = invitingUser
            }

        }


        const project = new Project()
        project.expert = expert
        project.lawyer = lawyer
        project.legals = projectLegalCopies

        project.manager = manager._id

        project.projectCode = projectCode
        project.projectTitle = title
        project.numberOfBuildings = numberOfBuilding
        project.numberOfFloors = numberOfFloor
        project.heightOfBuilding = heightOfBuilding
        project.surfaceOfBuilding = surfaceOfBuilding
        project.parkingOfBuilding = parkingOfBuilding
        project.features = features
        project.projectStartedDate = projectStartedDate
        project.projectCompleteDate = projectCompleteDate
        project.deliveryIn = deliveryIn
        project.country = country
        project.district = district
        project.city = city
        project.zip = zip
        project.address = address
        project.latitude = latitude
        project.longitude = longitude
        project.nearby = nearby
        project.buildingMedia = building

        project.twoRoomApartment = twoRoomApartment
        project.threeRoomApartment = threeRoomApartment
        project.fourRoomApartment = fourRoomApartment
        project.fiveRoomApartment = fiveRoomApartment
        project.office = office
        project.store = store

        project.description = description
        
        project.company = user.company
        project.developer = user._id

        await project.save()

        if(project.numberOfFloors){

            for(let i = 0; i < project.numberOfFloors; i++){
                const floor = new Floor()
                floor.floorNo = i
                floor.project = project._id  
                floor.developer = user._id  
                await floor.save()
            }
        }


        if(project.twoRoomApartment.total){

            for(let i = 0; i < project.twoRoomApartment.total; i++){
                await generatePropertiesForProject(project, rooms = 2, project.twoRoomApartment)
            }
        }

        if(project.threeRoomApartment.total){

            for(let i = 0; i < project.threeRoomApartment.total; i++){
                await generatePropertiesForProject(project, rooms = 3, project.threeRoomApartment)
            }
        }

        if(project.fourRoomApartment.total){

            for(let i = 0; i < project.fourRoomApartment.total; i++){
                await generatePropertiesForProject(project, rooms = 4, project.fourRoomApartment)
            }
        }


        if(project.fiveRoomApartment.total){

            for(let i = 0; i < project.fiveRoomApartment.total; i++){
                await generatePropertiesForProject(project, rooms = 4, project.fiveRoomApartment)
            }
        }

        if(project.office.total){

            for(let i = 0; i < project.office.total; i++){
                await generatePropertiesForProject(project, rooms = null, project.office)
            }
        }

        if(project.store.total){

            for(let i = 0; i < project.store.total; i++){
                await generatePropertiesForProject(project, rooms = null, project.store)
            }
        }

        //  const manager = selectManager ? await User.findOne({email: managerEmail, account_verified: true}) :  

        //  console.log('Managers: ', managers)
        //  return res.json({managers:managers})


        return res.json({ status: 'success' })

    } catch (error) {
        console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }

}


async function generatePropertiesForProject(project, rooms = null){

    const property = new property()
    property.pid = getCid()
    property.title = project.title
    property.propertyType = 'Apartment'
    property.propertySize = propertyDetails.surface || null
    property.price = propertyDetails.price || null
    property.bedroom = rooms
    property.rooms = rooms
    property.bathroom = propertyDetails.bathrooms || null
    property.floor = null
    // property.additionalDetails = additionalDetails
    property.features = project.features
    property.country = project.country
    property.district = project.district
    property.city = project.city
    property.zip = project.zip
    property.address = project.address
    property.latitude = project.latitude
    property.longitude = project.longitude
    property.readyTime = project.deliveryIn
    property.description = project.description
    property.nearby = project.nearby
    property.image = propertyDetails.image[0] || null
    property.images = propertyDetails.images || null
    property.virtualTourLink = propertyDetails.virtualTour || null
    property.videoLink = propertyDetails.videoLink || null

    property.developer = project.developer
    property.manager = project.manager
    property.company = project.company

    await property.save()

    project.properties = [...project.properties, property._id]
    await project.save() 

    return property
}