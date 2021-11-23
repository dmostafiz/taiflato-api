const Auction = require('../models/Auction');
const QueueUpload = require('../models/QueueUpload');
const AWS = require('aws-sdk');
const fs = require('fs');
const Project = require('../models/Project');
const Property = require('../models/Property');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

const s3 = new AWS.S3();

const uploadFile = async (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: process.env.AWS_BUCKET,
        ContentType: type.mime,
        Key: `${name}.${type.ext}`,
    };

    return s3.upload(params).promise();
};


function getProjectsAndUpdate(cron) {

    cron.schedule('* * * * *', async () => {

        return console.log('Ready for update project')

        const qus = await QueueUpload.find({ started: false, uploadFor: 'project' })

        // console.log('Queueable File: ', qus)

        qus.forEach(async qu => {

            qu.started = true
            await qu.save()

            const project_id = qu.project
            const file_type = qu.propertyType
            //  console.log('Queueable File: ', qu.buffer)

            const buffer = qu.buffer
            const fileName = qu.fileName
            const type = qu.type


            const data = await uploadFile(buffer, fileName, type);

            await qu.delete()

            if (data.Location) {

                console.log("file location: ", data.Location)

                const file = new File()
                file.bucket = data.Bucket
                file.eTag = data.ETag
                file.key = data.Key
                file.location = data.Location
                file.versionId = data.VersionId
                file.mime = type.mime
                file.fileExt = type.ext
                file.fileType = file_type
                file.folder = folder
                file.user = user._id

                await file.save()

                if (file) {

                    const project = await Project.findById(project_id)

                    if (project) {

                        if (file_type == 'expert_contract_copies') {
                            project.expert.copies = [...project.expert.copies, file._id]
                        }

                        else if (file_type == 'lawyer_contract_copies') {
                            project.lawyer.copies = [...project.lawyer.copies, file._id]
                        }

                        else if (file_type == 'project_legal_copies') {
                            project.legal.copies = [...project.legal.copies, file._id]
                        }

                        // Building  
                        else if (file_type == 'project_featured_image') {
                            project.projectImage = file._id
                            project.projectMedia.image = file._id
                        }

                        else if (file_type == 'project_additional_images') {
                            project.projectImages = [...project.projectImages, file._id]
                            project.projectMedia.images = [...project.projectMedia.images, file._id]
                        }

                        // Two room   
                        else if (file_type == 'tworoom_featured_image') {
                            project.twoRoomApartment.image = file._id

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Apartment',
                                rooms: 2
                            })

                            console.log('Properties Length: ', properties.length)

                            if (properties.length) {
                                properties.forEach(async pty => {
                                    pty.image = file._id
                                    pty.featuredImage = file._id
                                    await pty.save()
                                })
                            }

                        }

                        else if (file_type == 'tworoom_additional_images') {
                            project.twoRoomApartment.images = [...project.twoRoomApartment.images, file._id]

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Apartment',
                                rooms: 2
                            })

                            console.log('Properties Length: ', properties.length)

                            if (properties.length) {
                                properties.forEach(async pty => {
                                    pty.images = [...pty.images, file._id]
                                    pty.additionalImages = [...pty.additionalImages, file._id]
                                    await pty.save()
                                })

                            }

                        }

                        // Three room   
                        else if (file_type == 'threeroom_featured_image') {
                            project.threeRoomApartment.image = file._id

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Apartment',
                                rooms: 3
                            })

                            console.log('Properties Length: ', properties.length)

                            if (properties.length) {
                                properties.forEach(async pty => {
                                    pty.image = file._id
                                    pty.featuredImage = file._id
                                    await pty.save()
                                })
                            }
                        }

                        else if (file_type == 'threeroom_additional_images') {

                            project.threeRoomApartment.images = [...project.threeRoomApartment.images, file._id]

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Apartment',
                                rooms: 3
                            })

                            if (properties.length) {
                                properties.forEach(async pty => {

                                    pty.images = [...pty.images, file._id]
                                    pty.additionalImages = [...pty.additionalImages, file._id]

                                    await pty.save()
                                })
                            }

                        }

                        // Four room   
                        else if (file_type == 'fourroom_featured_image') {
                            project.fourRoomApartment.image = file._id

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Apartment',
                                rooms: 4
                            })

                            if (properties.length) {
                                properties.forEach(async pty => {

                                    pty.image = file._id
                                    pty.featuredImage = file._id

                                    await pty.save()
                                })
                            }

                        }

                        else if (file_type == 'fourroom_additional_images') {
                            project.fourRoomApartment.images = [...project.fourRoomApartment.images, file._id]

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Apartment',
                                rooms: 4
                            })

                            if (properties.length) {
                                properties.forEach(async pty => {

                                    pty.images = [...pty.images, file._id]
                                    pty.additionalImages = [...pty.additionalImages, file._id]

                                    await pty.save()
                                })
                            }

                        }

                        // Five room   
                        else if (file_type == 'fiveroom_featured_image') {
                            project.fiveRoomApartment.image = file._id

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Apartment',
                                rooms: 5
                            })

                            if (properties.length) {
                                properties.forEach(async pty => {

                                    pty.image = file._id
                                    pty.featuredImage = file._id

                                    await pty.save()
                                })
                            }

                        }

                        else if (file_type == 'fiveroom_additional_images') {
                            project.fiveRoomApartment.images = [...project.fiveRoomApartment.images, file._id]

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Apartment',
                                rooms: 5
                            })

                            if (properties.length) {
                                properties.forEach(async pty => {

                                    pty.images = [...pty.images, file._id]
                                    pty.additionalImages = [...pty.additionalImages, file._id]

                                    await pty.save()
                                })
                            }

                        }

                        // office 
                        else if (file_type == 'office_featured_image') {
                            project.office.image = file._id

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Office'
                            })

                            if (properties.length) {
                                properties.forEach(async pty => {

                                    pty.image = file._id
                                    pty.featuredImage = file._id

                                    await pty.save()
                                })
                            }
                        }

                        else if (file_type == 'office_additional_images') {
                            project.office.images = [...project.office.images, file._id]

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Office'
                            })

                            if (properties.length) {
                                properties.forEach(async pty => {

                                    pty.images = [...pty.images, file._id]
                                    pty.additionalImages = [...pty.additionalImages, file._id]

                                    await pty.save()
                                })
                            }

                        }

                        // store 
                        else if (file_type == 'store_featured_image') {
                            project.store.image = file._id

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Store'
                            })

                            if (properties.length) {
                                properties.forEach(async pty => {

                                    pty.image = file._id
                                    pty.featuredImage = file._id

                                    await pty.save()
                                })
                            }
                        }

                        else if (file_type == 'store_additional_images') {
                            project.store.images = [...project.store.images, file._id]

                            const properties = await Property.find({
                                project: project._id,
                                propertyType: 'Store'
                            })

                            if (properties.length) {
                                properties.forEach(async pty => {

                                    pty.images = [...pty.images, file._id]
                                    pty.additionalImages = [...pty.additionalImages, file._id]

                                    await pty.save()
                                })
                            }
                        }

                        await project.save()

                    }
                }

                console.log("file from upload controller: ", file)

                return res.json({ status: 'success', file })

            }

        })


    });

}

module.exports = getProjectsAndUpdate