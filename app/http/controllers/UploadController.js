const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const File = require('../../models/File');
const Property = require('../../models/Property');


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
          const user = await User.findOne({_id: data.id})

          if(user){
              const path = files.file[0].path;

              const folder = 'users/'+user.username+'/properties/'+fields.ref_id[0]
    
              const buffer = fs.readFileSync(path);
    
              const type = await fileType.fromBuffer(buffer);

              console.log('File Type: ', type)
    
              const fileName = `${folder}/${Date.now().toString()}`;
    
              const data = await uploadFile(buffer, fileName, type);
    
            //   console.log("uploaded file from upload controller: ", data)

              if(data.Location ){

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
                file.folder=folder
                file.user = user._id

                await file.save()

                if(file){
                    const property = await Property.findOne({_id: fields.ref_id[0]})

                    if(property){

                        if(file.fileType == 'property_featured_image'){
                            property.image = file._id
                        }else if(file.fileType == 'property_additional_images'){
                            const images = [...property.images, file._id]
                            property.images = images
                        }else if(file.fileType == 'property_floorplan_image'){
                            property.floorplanImage = file._id
                        }
    
                        property.save()

                        return res.status(201).json({property})
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