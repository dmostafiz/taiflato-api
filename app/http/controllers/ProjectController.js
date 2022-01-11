const jwt = require('jsonwebtoken')
const { property } = require('lodash')
const { customAlphabet } = require('nanoid')
const getCid = require('../../../helpers/getCid')
const mailTransporter = require('../../../helpers/mailTransporter')
const Company = require('../../models/Company')
const File = require('../../models/File')
const Floor = require('../../models/Floor')
const Invite = require('../../models/Invite')
const Project = require('../../models/Project')
const Property = require('../../models/Property')
const QueueProperty = require('../../models/QueueProperty')
const User = require("../../models/User")


exports.create_drafted_project = async (req, res) => {

    const {projectCode, title} = req.body

    const token = req.headers.authorization

    // console.log('Token: ', token)

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        let manager = user


        const project = new Project()

        project.cid = getCid()
        project.projectTitle = title
        project.projectCode = projectCode
        project.manager = manager._id
        project.company = user.company
        project.developer = user._id
        project.status = 'drafted'
        await project.save()


        // console.log('Created draft Project: ', project)

        return res.json({ status: 'success', project: project })

    } catch (error) {
        // console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }

}

exports.get_my_managers = async (req, res) => {
    const token = req.headers.authorization

    // console.log('My Token: ', token)

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


        const managers = await User.find({ realestate_admin: user._id, account_verified: true })

        // console.log('Managers: ', managers)
        return res.json({ status: 'success', managers: managers })



    } catch (error) {
        // console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }

}

exports.change_project_manager = async (req, res) => {
    const token = req.headers.authorization

    const {projectId, managerId} = req.body

    // console.log('My Token: ', token)

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        const manager = await User.findOne({ _id: managerId, account_verified: true })
        const project = await Project.findOne({ _id: projectId, developer: user._id })

        // console.log('New Manager: ', manager)
        // console.log('Project ID: ', projectId)
        // console.log('Project: ', project)

        if(manager && project){
            project.manager = manager._id 
            await project.save()

            const properties = await Property.find({project: project._id})

            if(properties){
                properties.forEach(async pty => {
                    pty.manager = manager
                    await pty.save()
                })
            }
        }

        // console.log('Managers: ', managers)
        return res.json({ status: 'success', manager: manager })


    } catch (error) {
        // console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }

}


exports.save_drafted_project = async (req, res) => {
    const token = req.headers.authorization

    const {
        project_id,
        selectManager,
        inviteManager,

        expert,
        lawyer,
        projectLegalCopies,
        managerEmail,
        // projectCode,
        // title,
        features,
        country,
        district,
        city,
        zip,
        address,
        latitude,
        longitude,
        nearby

    } = req.body
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


        const project = await Project.findOne({ _id: project_id, developer: user._id })

        // console.log('My Project: ', project)
        // return res.json({ status: 'success', project: project })


        if (!project) return res.json({ status: 'error', msg: 'Something went wrong' })

        project.cid = getCid()
        project.expert = expert
        project.lawyer = lawyer
        project.legal = { copies: projectLegalCopies }

        project.manager = manager._id

        // project.projectCode = projectCode
        // project.projectTitle = title

        project.features = features

        project.country = country
        project.district = district
        project.city = city
        project.zip = zip
        project.address = address
        project.latitude = latitude
        project.longitude = longitude
        project.nearby = nearby
        project.company = user.company
        project.developer = user._id

        await project.save()

        // const company = await Company.findById(user.company)

        // if (company) {
        //     company.projects = [...company.projects, project._id]
        //     await company.save()
        // }

        manager.projects = [...manager.projects, project._id]
        await manager.save()


        return res.json({ status: 'success', project: project })

    } catch (error) {
        // console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }

}

exports.get_projects = async (req, res) => {
    const token = req.headers.authorization

    // console.log('My Token: ', token)

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        var query = {
            company: user.company
        }

        if (user.is_realestate_admin == false) {
            query['manager'] = user._id
        }

        const projects = await Project.find(query)
            .populate([
                {
                    path: 'projectImage',
                    model: 'File'
                }
            ])

        // console.log('projects: ',projects)

        res.json({ status: 'success', projects })

    }
    catch (error) {
        // console.log('Error: ', error.message)
        res.json({ status: 'error', msg: error.message, projects: [] })
    }
}

exports.get_project_by_id = async (req, res) => {
    const id = req.params.id

    try {
        const project = await Project.findById(id)
            .populate([
                {
                    path: 'projectImage',
                    model: 'File'
                },
                {
                    path: 'projectImages',
                    model: 'File'
                },
                {
                    path: 'expert.copies',
                    model: 'File'
                },
                {
                    path: 'lawyer.copies',
                    model: 'File'
                },
                {
                    path: 'legal.copies',
                    model: 'File'
                },
                {
                    path: 'properties',
                    model: 'Property',
                    // populate: {
                    //     path: 'floor',
                    //     model: 'Floor',    
                    // }
                },
                {
                    path: 'floors',
                    model: 'Floor'
                },
                {
                    path: 'manager',
                    model: 'User'
                },
            ])

            // console.log("project: ", project)

        return res.json({ status: 'success', project })

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: 'Something went wrong' })
    }
}

exports.get_properties_by_project = async (req, res) => {
    const id = req.params.id

    try {
        const project = await Project.findById(id)
            .populate([])

            // console.log("project: ", project)
        if(project){
            const properties = await Property.find({project:project._id}).populate([
                {
                    path: 'image',
                    model: 'File'
                }
            ])
                                             
            return res.json({ status: 'success', properties })
        }


    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: 'Something went wrong' })
    }   
}
// exports.get_properties_by_projectid = async (req, res) => {
//     const id = req.params.projectId

//     try {
//            const project = await Project.findById(id)
  
//             if(project){
//                 const properties = await Property.find({project: project._id})
//                                          .populate([
//                                              {
//                                                  path:'floor',
//                                                  model:'Floor'
//                                              }
//                                          ])

                // console.log("project: ", properties)

//                 return res.json({ status: 'success', properties })
//             }



//     } catch (error) {
        // console.log('Error: ', error.message)
//         return res.json({ status: 'error', msg: 'Something went wrong' })
//     }
// }

exports.update_property = async (req, res) => {
    const token = req.headers.authorization

    const { propertyId, title, rooms, bathroom, propertyType, serialNo, floor, price, balcony, terrace, garden, loggia } = req.body

    // console.log('My Token: ', token)

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        const property = await Property.findById(propertyId)

        property.title = title
        property.rooms = rooms
        property.bathroom = bathroom
        property.serialNo = serialNo
        property.floor = floor
        property.price = price
        property.propertyType =propertyType
        property.isUpdated = true
        property.balcony = balcony
        property.terrace = terrace
        property.garden = garden
        property.loggia = loggia

        await property.save()

        const project = await Project.findById(property.project)
            .populate([
                {
                    path: 'projectImage',
                    model: 'File'
                },
                {
                    path: 'expert.copies',
                    model: 'File'
                },
                {
                    path: 'lawyer.copies',
                    model: 'File'
                },
                {
                    path: 'legal.copies',
                    model: 'File'
                },
                {
                    path: 'properties',
                    model: 'Property'
                },
                {
                    path: 'floors',
                    model: 'Floor'
                },
            ])

        const gfloor = await Floor.findOne({ project: project._id, floorNo: floor })
        gfloor.properties = [...gfloor.properties, property._id]
        await gfloor.save()

        // console.log('Update floor: ', gfloor)
        return res.json({ status: 'success', project })
    }
    catch (error) {
        res.json({ status: 'success', msg: error.message })
    }
}

exports.save_project_properties = async (req, res) => {
    const token = req.headers.authorization

    const { properties, projectId } = req.body

    // console.log('properties : ', properties)
    // return res.json({ status: 'success' })

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        const project = await Project.findOne({ _id: projectId, developer: user._id })

        // console.log('project : ', project)


        if (project) {

            if (properties.length) {
                properties.forEach(async (pty) => {

                    const qpty = new QueueProperty()

                    qpty.propertyType = pty.type
                    qpty.numberOfRooms = pty.numberOfRooms
                    qpty.numberOfBathrooms = pty.numberOfBathrooms
                    qpty.propertySize = pty.surfaceArea
                    qpty.price = pty.price
                    qpty.total = pty.total
                    qpty.virtualTour = pty.virtualTour
                    qpty.videoLink = pty.videoLink
                    qpty.image = pty.image
                    qpty.images = pty.images
                    qpty.project = project._id
                    qpty.company = project.company
                    qpty.developer = project.developer
                    qpty.manager = project.manager

                    await qpty.save()
                })
            }

        }

        return res.json({ status: 'success', project })


    } catch (error) {
        // console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }

}

exports.save_project_details = async (req, res) => {
    const token = req.headers.authorization

    const { project_id,
        numberOfBuilding,
        numberOfFloor,
        heightOfBuilding,
        surfaceOfBuilding,
        parkingOfBuilding,
        features,
        projectStartedDate,
        projectCompleteDate,
        deliveryIn,
        projectImage,
        projectImages,
        virtualTour,
        videoLink,
        description } = req.body

    // console.log('properties : ', properties)
    // return res.json({ status: 'success' })

    if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

        const project = await Project.findOne({ _id: project_id, developer: user._id })


        if (project) {

            project.numberOfBuildings = numberOfBuilding
            project.numberOfFloors = numberOfFloor
            project.heightOfBuilding = heightOfBuilding
            project.surfaceOfBuilding = surfaceOfBuilding
            project.parkingOfBuilding = parkingOfBuilding
            project.features = features
            project.projectStartedDate = projectStartedDate
            project.projectCompleteDate = projectCompleteDate
            project.deliveryIn = deliveryIn
            project.projectImage = projectImage[0]
            project.projectImages = projectImages
            project.virtualTour = virtualTour
            project.videoLink = videoLink
            project.description = description
            project.status = 'pending'

            await project.save()



            for(let i = 0; i < project.numberOfFloors; i++){

                const floor = new Floor()
                floor.floorNo = i
                floor.project = project._id 
                floor.developer = project.developer 
                await floor.save()

                project.floors = [...project.floors, floor._id]
                await project.save()

            }

            const company = await Company.findById(project.company)

            if(company){
                company.projects = [...company.projects, project._id]
                await company.save()
            }

            return res.json({ status: 'success', project })
        }



    } catch (error) {
        // console.log('Error: ', error)
        return res.json({ status: 'error', msg: 'Your are not authorised' })
    }

}
