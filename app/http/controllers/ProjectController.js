const jwt = require('jsonwebtoken')
const { customAlphabet } = require('nanoid')
const getCid = require('../../../helpers/getCid')
const mailTransporter = require('../../../helpers/mailTransporter')
const File = require('../../models/File')
const Floor = require('../../models/Floor')
const Invite = require('../../models/Invite')
const Project = require('../../models/Project')
const Property = require('../../models/Property')
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
        // projectLegalCopies,
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
        projectMedia,

        twoRoomApartment,
        threeRoomApartment,
        fourRoomApartment,
        fiveRoomApartment,
        office,
        store,

        description

    } = req.body

    console.log('twoRoomApartment : ', twoRoomApartment )
    // return res.json({ status: 'success' })

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
        // project.legals = projectLegalCopies

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
        // project.buildingImage = building?.image[0] || null
        // project.buildingImages = building?.images || null
        project.videoLink = projectMedia?.videoLink || null
        project.virtualTour = projectMedia?.virtualTour || null
        project.projectMedia = projectMedia

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

        const twoRoomTotal = twoRoomApartment?.total || 0
        if(parseInt(twoRoomTotal)){

            for(let i = 0; i < parseInt(twoRoomTotal); i++){
                await generatePropertiesForProject(project, rooms = 2, twoRoomApartment, 'Apartment')
            }
        }

        const threeRoomTotal = threeRoomApartment?.total || 0
        if(parseInt(threeRoomTotal)){

            for(let i = 0; i < parseInt(threeRoomTotal); i++){
                await generatePropertiesForProject(project, rooms = 3, threeRoomApartment, 'Apartment')
            }
        }

        const fourRoomTotal = fourRoomApartment?.total || 0
        if(parseInt(fourRoomTotal)){

            for(let i = 0; i < parseInt(fourRoomTotal); i++){
                await generatePropertiesForProject(project, rooms = 4, fourRoomApartment, 'Apartment')
            }
        }

        const fiveRoomTotal = fiveRoomApartment?.total || 0
        if(parseInt(fiveRoomTotal)){

            for(let i = 0; i < parseInt(fiveRoomTotal); i++){
                await generatePropertiesForProject(project, rooms = 5, fiveRoomApartment, 'Apartment')
            }
        }

        const officeTotal = office?.total || 0
        if(parseInt(officeTotal)){

            for(let i = 0; i < parseInt(officeTotal); i++){
                await generatePropertiesForProject(project, rooms = 0, office, 'Office')
            }
        }

        const storeTotal = store?.total || 0
        if(parseInt(storeTotal)){

            for(let i = 0; i < parseInt(storeTotal); i++){
                await generatePropertiesForProject(project, rooms = 0, store, 'Store')
            }
        }

        //  const manager = selectManager ? await User.findOne({email: managerEmail, account_verified: true}) :  

        //  console.log('Managers: ', managers)
        //  return res.json({managers:managers})

        console.log('Saved Project: ', project)

        return res.json({ status: 'success', project: project })

    } catch (error) {
        console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }

}

exports.get_project_by_id = async (req, res) => {
    const id = req.params.id

    try {
        const project = await Project.findById(id)


        return res.json({ status: 'success', project })

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: 'Something went wrong' })
    }
}

// exports.generate_properties = async (req, res) => {

//     const token = req.headers.authorization

//     const { projectId } = req.body

//     console.log('projectId: ', projectId)

//     if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

//     try {

//         const data = jwt.verify(token, process.env.APP_SECRET)

//         const user = await User.findOne({ _id: data.id })

//         if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        

//         const project = await Project.findById(projectId)

//         console.log('Generrating property for: ', project)

//         if (project) {

//             if (project.twoRoomApartment.total) {
//                 for (let i = 0; i < project.twoRoomApartment.total; i++) {
//                     await generatePropertiesForProject(project, rooms = 2, project.twoRoomApartment, 'Apartment')
//                 }
//             }

//             if (project.threeRoomApartment.total) {
//                 for (let i = 0; i < project.threeRoomApartment.total; i++) {
//                     await generatePropertiesForProject(project, rooms = 3, project.threeRoomApartment, 'Apartment')
//                 }
//             }


//         }

//         return res.json({ status: 'success', project})


//     } catch (error) {
//         console.log('Error: ', error)
//         return res.json({ status: 'error', msg: 'Your are not authorised' })
//     }
// }

async function generatePropertiesForProject(project, rooms = null, propertyDetails, type) {

    const property = new Property()
    property.pid = getCid()
    property.title = project.projectTitle
    property.propertyType = type
    property.propertySize = parseInt(propertyDetails.surface) || 0
    property.price = parseInt(propertyDetails.price) || 0
    property.bedroom = parseInt(rooms) || 0
    property.rooms = parseInt(rooms) || 0
    property.bathroom = parseInt(propertyDetails.bathrooms) || 0
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

    // property.featuredImage = propertyDetails?.image || null
    // property.image = propertyDetails?.image || null

    // property.additionalImages = propertyDetails?.images || null
    // property.images = propertyDetails?.images || null

    property.virtualTourLink = propertyDetails?.virtualTour || null
    property.videoLink = propertyDetails?.videoLink || null

    property.developer = project.developer
    property.manager = project.manager
    property.company = project.company
    property.project = project._id


    await property.save()

    // const file = await File.findOne({location: propertyDetails?.image?.shift() }) 
    // if(file){
    //     property.image = file._id
    //     await property.save()
    // }

    // project.properties = [...project.properties, property._id]
    // await project.save() 

    return property
}