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
const QueueUpload = require('../../models/QueueProperty');

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


exports.queueProjectImage = async (req, res) => {


    const queueUpload = new QueueUpload()


    const form = new multiparty.Form();

    form.parse(req, async (error, fields, files) => {

        if (error) {
            console.log('Form Error Ocurred')
            return res.json('Form Error Ocurred')
        }

        try {
            const token = fields.token[0]
            const file_type = fields.file_type[0]
            const project_id = fields.ref_id[0]

            const data = jwt.verify(token, process.env.APP_SECRET)
            const user = await User.findOne({ _id: data.id })

            if (user) {
                const path = files.file[0].path;

                const folder = user.username + '/projects/' + project_id + '/' + fields.ref_id[0]

                const buffer = fs.readFileSync(path);

                const type = await fileType.fromBuffer(buffer)

                const fileName = `${folder}/${Date.now().toString()}`;

                console.log('File Buffer: ', type)

                queueUpload.buffer = buffer
                queueUpload.type = type
                queueUpload.fileName = fileName
                queueUpload.user = user._id
                queueUpload.folder = folder
                queueUpload.uploadFor = 'project'
                queueUpload.project = project_id
                queueUpload.propertyType = file_type

                await queueUpload.save()

                console.log('Queueable Upload: ', queueUpload)

                return res.json({ status: 'success', file: queueUpload })

            }

        } catch (error) {
            console.log('Error: ', error.message)
            return res.json({ status: 'error', msg: error.message })
        }


    })

    return res.json({ status: 'success' })
    // const form = new multiparty.Form();

    // form.parse(req, async (error, fields, files) => {

    //   console.log('Upload file', files)
    //   return res.json({ status: 'success'})

    //   if (error) {
    //     console.log('Form Error Ocurred')
    //     return res.json({ status: 'error', msg: 'Form Error Ocurred' })

    //   }

    //   try {

    //     // const token = fields.tken

    //     const token = fields.token[0]

    //     console.log('Upload Token: ', token)

    //     const data = jwt.verify(token, process.env.APP_SECRET)
    //     const user = await User.findOne({ _id: data.id })

    //     console.log('Upload User: ', user)

    //     if (user) {
    //       const path = files.file[0].path;

    //       const folder = 'users/profile/' + user.username

    //       const buffer = fs.readFileSync(path);

    //       const type = await fileType.fromBuffer(buffer);

    //       console.log('File Type: ', type)

    //       const fileName = `${folder}/${Date.now().toString()}`;

    //       const data = await uploadFile(buffer, fileName, type);

    //       //   console.log("uploaded file from upload controller: ", data)

    //       if (data.Location) {

    //         console.log("file location: ", data.Location)

    //         const file = new File()
    //         file.bucket = data.Bucket
    //         file.eTag = data.ETag
    //         file.key = data.Key
    //         file.location = data.Location
    //         file.versionId = data.VersionId
    //         file.mime = type.mime
    //         file.fileExt = type.ext
    //         file.fileType = fields.file_type[0]
    //         file.folder = folder
    //         file.user = user._id

    //         await file.save()

    //         if (file) {

    //           user.avatar = file.location
    //           await user.save()
    //           return res.status(201).json({ status: 'success', data: user })
    //         }
    //       }

    //       // console.log("file from upload controller: ", file)

    //       // return res.status(201).json({file})

    //     }

    //   }



    //   catch (err) {

    //     console.log('Server Error: ', err)
    //     return res.json({ status: 'error', msg: err.message });

    //   }

    // })

}