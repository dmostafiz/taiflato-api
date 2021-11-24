const getCid = require('../../helpers/getCid');
const Project = require('../models/Project');
const Property = require('../models/Property');
const QueueProperty = require('../models/QueueProperty');


function getProjectsAndUpdate(cron) {

    cron.schedule('* * * * *', async () => {

        console.log('Ready for update project')

        const queuedProperty = await QueueProperty.findOne({ started: false })
        queuedProperty.started = true 
        await queuedProperty.save()

        if(queuedProperty)
        {
            const project = await Project.findById(queuedProperty.project)

            // return console.log('project: ', project)

            if(project){

                console.log('queuedProperty.total: ', queuedProperty.total)

                 for(let i = 0; i < queuedProperty.total; i++){

                    console.log('i : ', i)

                    try {

                        const property = new Property()

                        property.pid = getCid()
    
                        property.title = queuedProperty.propertyType + ' in ' + project.projectTitle
                        property.propertyType = queuedProperty.propertyType
                        property.propertySize = queuedProperty.propertySize || 0
                        property.price = queuedProperty.price || 0
                        property.bedroom = queuedProperty.numberOfRooms || 0
                        property.rooms = queuedProperty.numberOfRooms || 0
                        property.bathroom = queuedProperty.numberOfBathrooms || 0
                        property.floor = null
                        // property.featuredImage = featuredImage
                        property.image = queuedProperty.image
                    
                        // property.additionalImages = additionalImages
                        property.images = queuedProperty.images
                    
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
    
                        property.virtualTourLink = queuedProperty.virtualTour || null
                        property.videoLink = queuedProperty.videoLink || null
                    
                        property.developer = project.developer
                        property.manager = project.manager
                        property.company = project.company
                        property.project = project._id
    
                        await property.save()
    
                        project.properties = [...project.properties, property._id]
                        await project.save()

                        // console.log('Property: ', property)
                        
                    } catch (error) {

                        console.log('Property Error: ', error.message)
                        
                    }



                }
            }


            await queuedProperty.delete()
        }

    

    });

}

module.exports = getProjectsAndUpdate