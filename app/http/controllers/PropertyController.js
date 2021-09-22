const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Property = require('../../models/Property');
const File = require('../../models/File');


// AWS.config.update({
//     accessKeyId: 'AKIAW7OWVSOQTG45HKDA',
//     secretAccessKey: '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',
//   });
  
// const s3 = new AWS.S3();

// const uploadFile = async (buffer, name, type) => {
//     const params = {
//       ACL: 'public-read',
//       Body: buffer,
//       Bucket: 'ipproperties',
//       ContentType: type.mime,
//       Key: `${name}.${type.ext}`,
//     };

//     return s3.upload(params).promise();
// };

// exports.uploadSingle = async (req, res) => {

      
      

//       const form = new multiparty.Form();

//       form.parse(req, async (error, fields, files) => {
  
//           if (error) {
//             console.log('Form Error Ocurred')  
//             return res.json('Form Error Ocurred')

//           }


//           try {

//             // const token = fields.tken

//             const token = fields.token[0]

//             const data = jwt.verify(token, process.env.APP_SECRET)
//             const user = await User.findOne({_id: data.id})

//             if(user){
//                 const path = files.file[0].path;

//                 const folder = user.username
      
//                 const buffer = fs.readFileSync(path);
      
//                 const type = await fileType.fromBuffer(buffer);

//                 // console.log('File Type: ', type)
      
//                 const fileName = `${folder}/${Date.now().toString()}`;
      
//                 const data = await uploadFile(buffer, fileName, type);
      
//                 console.log("uploaded file: ", data)

//                 if(data){
//                   const file = new File()
//                   file.bucket = data.Bucket
//                   file.eTag = data.ETag 
//                   file.key = data.Key
//                   file.location = data.Location
//                   file.versionId = data.VersionId
//                   file.mime = type.mime
//                   file.fileExt = type.ext
//                   file.user = user._id
//                   await file.save()
//                 }
          
//                 return res.status(201).json({data})
//             }

            
          
//           } catch (err) {
  
//             return err;
  
//           }
          
//        })

 

// }

exports.saveProperty = async (req, res) => {

  // console.log("Property Data: ", req.body)

  const token = req.headers.authorization
  console.log('Server Token:', token)

  const {
    title,
    propertyType,
    propertySize,
    propertyPrice,
    bedroomNumber,
    bathroomNumber,
    garageSize,
    additionalDetails,
    features,
    country,
    district,
    city,
    zip,
    address,
    saleStatus,
    willReadyForSale,
    investPrice,
    latitude,
    longitude,
    description,
    nearby,
    virtualTour

  } = req.body


  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({_id: data.id})
 
    if(user) {
      
      // console.log('User: ',user)
      const property = new Property()
      property.title = title
      property.propertyType = propertyType
      property.propertySize = propertySize
      property.price = propertyPrice
      property.bedroom = bedroomNumber
      property.bathroom = bathroomNumber
      property.garageSize = garageSize
      property.additionalDetails = additionalDetails
      property.features = features
      property.country = country
      property.district = district
      property.city = city
      property.zip = zip
      property.address = address
      property.latitude = latitude
      property.longitude = longitude
      property.saleStatus = saleStatus
      property.readyTime = willReadyForSale
      property.investPrice = investPrice
      property.description = description
      property.nearby = nearby
      property.virtualTourLink = virtualTour

      await property.save()

      console.log(property)

      res.json(property)
    }


    
  } catch (error) {
    
  }


}