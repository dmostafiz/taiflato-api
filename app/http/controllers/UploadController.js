const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const File = require('../../models/File');
const Property = require('../../models/Property');
const Floor = require('../../models/Floor');
const Building = require('../../models/Building');
const Company = require('../../models/Company');
const Project = require('../../models/Project');
const getCid = require('../../../helpers/getCid');

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

exports.uploadPropertyImage = async (req, res) => {


  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {

    if (error) {
      console.log('Form Error Ocurred')
      return res.json('Form Error Ocurred')

    }

    try {

      // const token = fields.tken

      const token = fields.token[0]

      const data = jwt.verify(token, process.env.APP_SECRET)
      const user = await User.findOne({ _id: data.id })

      if (user) {
        const path = files.file[0].path;

        const folder = 'users/' + user.username + '/properties/' + fields.ref_id[0]

        const buffer = fs.readFileSync(path);

        const type = await fileType.fromBuffer(buffer);

        console.log('File Type: ', type)

        const fileName = `${folder}/${Date.now().toString()}`;

        const data = await uploadFile(buffer, fileName, type);

        //   console.log("uploaded file from upload controller: ", data)

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
          file.fileType = fields.file_type[0]
          file.folder = folder
          file.user = user._id

          await file.save()

          if (file) {
            const property = await Property.findOne({ _id: fields.ref_id[0] })

            if (property) {

              if (file.fileType == 'property_featured_image') {
                property.image = file._id
              } else if (file.fileType == 'property_additional_images') {
                const images = [...property.images, file._id]
                property.images = images
              } else if (file.fileType == 'property_floorplan_image') {
                property.floorplanImage = file._id
              }

              property.save()

              return res.status(201).json({ property })
            }
          }

          // console.log("file from upload controller: ", file)

          // return res.status(201).json({file})

        }

      }



    } catch (err) {

      return err;

    }

  })



}


exports.uploadBuildingImage = async (req, res) => {

  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {

    if (error) {
      console.log('Form Error Ocurred')
      return res.json('Form Error Ocurred')

    }

    try {

      // const token = fields.tken

      const token = fields.token[0]

      const data = jwt.verify(token, process.env.APP_SECRET)
      const user = await User.findOne({ _id: data.id })

      if (user) {
        const path = files.file[0].path;

        const folder = 'users/' + user.username + '/building/' + fields.ref_id[0]

        const buffer = fs.readFileSync(path);

        const type = await fileType.fromBuffer(buffer);

        console.log('File Type: ', type)

        const fileName = `${folder}/${Date.now().toString()}`;

        const data = await uploadFile(buffer, fileName, type);

        //   console.log("uploaded file from upload controller: ", data)

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
          file.fileType = fields.file_type[0]
          file.folder = folder
          file.user = user._id

          await file.save()

          if (file) {

            const building = await Building.findOne({ _id: fields.ref_id[0] })

            if (building) {

              if (file.fileType == 'building_image') {
                building.buildingImage = file._id
              } else if (file.fileType == 'gallery_images') {
                const galleryImages = [...building.galleryImages, file._id]
                building.galleryImages = galleryImages
              }

              // else if(file.fileType == 'floorplan_image'){
              //     property.floorplanImage = file._id
              // }

              building.save()

              return res.status(201).json({ building })
            }
          }

          // console.log("file from upload controller: ", file)

          // return res.status(201).json({file})

        }

      }



    } catch (err) {

      console.log('Server Error: ', err)
      return res.json({ status: 'error', msg: 'Server error occured' });

    }

  })



}


exports.uploadFloorImage = async (req, res) => {

  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {

    if (error) {
      console.log('Form Error Ocurred')
      return res.json('Form Error Ocurred')

    }

    try {

      // const token = fields.tken

      const token = fields.token[0]

      const data = jwt.verify(token, process.env.APP_SECRET)
      const user = await User.findOne({ _id: data.id })

      if (user) {
        const path = files.file[0].path;

        const folder = 'users/' + user.username + '/floors/' + fields.ref_id[0]

        const buffer = fs.readFileSync(path);

        const type = await fileType.fromBuffer(buffer);

        console.log('File Type: ', type)

        const fileName = `${folder}/${Date.now().toString()}`;

        const data = await uploadFile(buffer, fileName, type);

        //   console.log("uploaded file from upload controller: ", data)

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
          file.fileType = fields.file_type[0]
          file.folder = folder
          file.user = user._id

          await file.save()

          if (file) {

            const floor = await Floor.findOne({ _id: fields.ref_id[0] })

            if (floor) {

              if (file.fileType == 'floor_image') {
                floor.image = file._id
              }

              // else if(file.fileType == 'floorplan_image'){
              //     property.floorplanImage = file._id
              // }

              floor.save()

              return res.status(201).json({ floor })
            }
          }

          // console.log("file from upload controller: ", file)

          // return res.status(201).json({file})

        }

      }



    } catch (err) {

      console.log('Server Error: ', err)
      return res.json({ status: 'error', msg: 'Server error occured' });

    }

  })



}


exports.uploadProfileImage = async (req, res) => {
  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {

    if (error) {
      console.log('Form Error Ocurred')
      return res.json({ status: 'error', msg: 'Form Error Ocurred' })

    }

    try {

      // const token = fields.tken

      const token = fields.token[0]

      console.log('Upload Token: ', token)

      const data = jwt.verify(token, process.env.APP_SECRET)
      const user = await User.findOne({ _id: data.id })

      console.log('Upload User: ', user)

      if (user) {
        const path = files.file[0].path;

        const folder = 'users/profile/' + user.username

        const buffer = fs.readFileSync(path);

        const type = await fileType.fromBuffer(buffer);

        console.log('File Type: ', type)

        const fileName = `${folder}/${Date.now().toString()}`;

        const data = await uploadFile(buffer, fileName, type);

        //   console.log("uploaded file from upload controller: ", data)

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
          file.fileType = fields.file_type[0]
          file.folder = folder
          file.user = user._id

          await file.save()

          if (file) {

            user.avatar = file.location
            await user.save()
            return res.status(201).json({ status: 'success', data: user })
          }
        }

        // console.log("file from upload controller: ", file)

        // return res.status(201).json({file})

      }

    }



    catch (err) {

      console.log('Server Error: ', err)
      return res.json({ status: 'error', msg: err.message });

    }

  })

}

exports.uploadCompanyLogo = async (req, res) => {
  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {

    if (error) {
      console.log('Form Error Ocurred')
      return res.json({ status: 'error', msg: 'Form Error Ocurred' })

    }

    try {

      // const token = fields.tken

      const token = fields.token[0]

      console.log('Upload Token: ', fields)

      const data = jwt.verify(token, process.env.APP_SECRET)
      const user = await User.findOne({ _id: data.id })


      console.log('Upload User: ', user)

      if (user) {

        const company = await Company.findOne({ admin: user._id })

        const path = files.file[0].path;

        const folder = 'users/company/' + user.username

        const buffer = fs.readFileSync(path);

        const type = await fileType.fromBuffer(buffer);

        console.log('File Type: ', type)

        const fileName = `${folder}/${Date.now().toString()}`;

        const data = await uploadFile(buffer, fileName, type);

        //   console.log("uploaded file from upload controller: ", data)

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
          file.fileType = fields.file_type[0]
          file.folder = folder
          file.user = user._id

          await file.save()

          if (file) {

            company.logo = file.location
            await company.save()

            return res.json({ status: 'success', data: user })
          }
        }

        // console.log("file from upload controller: ", file)

        // return res.status(201).json({file})

      }

    }



    catch (err) {

      console.log('Server Error: ', err)
      return res.json({ status: 'error', msg: err.message });

    }

  })

}


exports.test_example = async (req, res) => {


  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {

    if (error) {
      console.log('Form Error Ocurred')
      return res.json('Form Error Ocurred')
    }

    try {

      // const token = fields.tken

      const token = fields.token[0]
      const file_type = fields.file_type[0]
      const project_id = fields.ref_id[0]

      // return console.log('project_id: ', project_id)

      // return res.json({ status: 'success' })

      const data = jwt.verify(token, process.env.APP_SECRET)
      const user = await User.findOne({ _id: data.id })

      if (user) {
        const path = files.file[0].path;

        const folder = 'users/' + user.username + '/projects/' + fields.ref_id[0]

        const buffer = fs.readFileSync(path);

        const type = await fileType.fromBuffer(buffer);

        console.log('File Type: ', type)

        const fileName = `${folder}/${Date.now().toString()}`;

        const data = await uploadFile(buffer, fileName, type);

        //   console.log("uploaded file from upload controller: ", data)

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

          console.log("project_id: ", project_id)

          if (file) {

            const project = await Project.findOne({ _id: project_id, developer: user._id })

            // return console.log('Upload for project: ', project)

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

      }



    } catch (err) {

      return err;

    }

  })



}


exports.upload_project_image = async (req, res) => {


  // console.log('Ok: ', req.body)
  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {

    // console.log('files: ', files)

    if (error) {
      console.log('Error: ', error)
      return res.json({ status: 'error', error })
    }

    try {

      // const token = fields.tken

      const token = fields.token[0]
      const project_id = fields.project_id[0]

      console.log('project_id: ', project_id)
      console.log('token: ', token)

      const data = jwt.verify(token, process.env.APP_SECRET)
      const user = await User.findOne({ _id: data.id })

      // console.log('File Paths: ', files.file)
      
      if (user && files.file.length) {

        const uploadedIds = []

         await files.file.forEach(async (file, index) => {
          // console.log(index, 'Single File: ', file)
          const path = file.path 
          const folder =  user.username + '/projects/' + project_id
          const buffer = fs.readFileSync(path);
          const type = await fileType.fromBuffer(buffer);
          const fileName = `${folder}/${getCid()}`;

          const data = await uploadFile(buffer, fileName, type)


          if(data){
            const file = new File()
            file.bucket = data.Bucket
            file.eTag = data.ETag
            file.key = data.Key
            file.location = data.Location
            file.versionId = data.VersionId
            file.mime = type.mime
            file.fileExt = type.ext
            file.folder = folder
            file.user = user._id
  
            await file.save()

            uploadedIds.push(file._id)

            if(uploadedIds.length == files.file.length){
              console.log(uploadedIds.length, 'All files has been uploaded')
              return res.json({ status: 'success', files:uploadedIds })
          }

          }


        })

        
          // console.log('All uploaded: ', uploaded)
    
        
      }

      // return res.json({ status: 'success', files })
      // return console.log('project_id: ', project_id)

      // return res.json({ status: 'success' })



  


    } catch (err) {
      console.log("Uplaod Error: ", err.message)

      return err;

    }

  })



}


exports.upload_plan_image = async (req, res) => {


  // console.log('Ok: ', req.body)
  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {

    // console.log('files: ', files)

    if (error) {
      console.log('Error: ', error)
      return res.json({ status: 'error', error })
    }

    try {

      // const token = fields.tken

      const token = fields.token[0]
      const project_id = fields.project_id[0]

      console.log('project_id: ', project_id)
      console.log('token: ', token)

      const data = jwt.verify(token, process.env.APP_SECRET)
      const user = await User.findOne({ _id: data.id })

      // console.log('File Paths: ', files.file)
      
      if (user && files.file.length) {

        const uploadLocations = []

         await files.file.forEach(async (file, index) => {
          // console.log(index, 'Single File: ', file)
          const path = file.path 
          const folder =  user.username + '/projects/' + project_id
          const buffer = fs.readFileSync(path);
          const type = await fileType.fromBuffer(buffer);
          const fileName = `${folder}/${getCid()}`;

          const data = await uploadFile(buffer, fileName, type)


          if(data){
            const file = new File()
            file.bucket = data.Bucket
            file.eTag = data.ETag
            file.key = data.Key
            file.location = data.Location
            file.versionId = data.VersionId
            file.mime = type.mime
            file.fileExt = type.ext
            file.folder = folder
            file.user = user._id
  
            await file.save()

            uploadLocations.push(file.location)

            if(uploadLocations.length == files.file.length){
              console.log(uploadLocations.length, 'All files has been uploaded')
              return res.json({ status: 'success', files:uploadLocations })
          }

          }


        })
        
      }


    } catch (err) {
      console.log("Uplaod Error: ", err.message)

      return err;

    }

  })



}


exports.upload_process_agreement = async (req, res) => {

  // console.log('Ok: ', req.body)
  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {

    // console.log('files: ', files)

    if (error) {
      console.log('Error: ', error)
      return res.json({ status: 'error', error })
    }

    try {

      // const token = fields.tken

      // return console.log('Upload fields: ', fields)

      const token = fields.token[0]
      const process_id = fields.process_id[0]

      console.log('process_id: ', process_id)
      // return console.log('token: ', token)

      const data = jwt.verify(token, process.env.APP_SECRET)
      const user = await User.findOne({ _id: data.id })

      // return console.log('File Paths: ', files)
      
      if (user && files.file.length) {

        const uploadedIds = []

         await files.file.forEach(async (file, index) => {
          // return console.log(index, 'Single File: ', file)
          const path = file.path 
          const folder =  user.username + '/process/' + process_id
          const buffer = fs.readFileSync(path);
          const type = await fileType.fromBuffer(buffer);
          const originalFilename = file.originalFilename.split('.')[0]
          const fileName = `${folder}/${originalFilename}-${getCid()}`;

          // return console.log('originalFilename: ', originalFilename)
          const data = await uploadFile(buffer, fileName, type)


          if(data){
            const file = new File()
            file.fileName = originalFilename
            file.bucket = data.Bucket
            file.eTag = data.ETag
            file.key = data.Key
            file.location = data.Location
            file.versionId = data.VersionId
            file.mime = type.mime
            file.fileExt = type.ext
            file.folder = folder
            file.user = user._id
  
            await file.save()

            uploadedIds.push(file.location)

            if(uploadedIds.length == files.file.length){
              console.log(uploadedIds.length, 'All files has been uploaded')
              return res.json({ status: 'success', files:uploadedIds })
          }

          }


        })

        
          // console.log('All uploaded: ', uploaded)
    
        
      }

      // return res.json({ status: 'success', files })
      // return console.log('project_id: ', project_id)

      // return res.json({ status: 'success' })



  


    } catch (err) {
      console.log("Uplaod Error: ", err.message)

      return err;

    }

  })



}