const mongoose = require('mongoose')
const Property = require("../../models/Property")

exports.getFeaturedProperties = async (req, res) => {
     
    try {

        const properties = Property.aggregate()
        // .pipeline([
        //     {
        //         developer: {
        //             password: -1
        //         }
        //     }
        // ])
        .sort({createdAt:-1})
        .limit(4)
        .lookup({
            from: 'files',
            localField: 'image',
            foreignField: '_id',
            as: 'image'
        })

        .lookup({
            from: 'files',
            localField: 'images',
            foreignField: '_id',
            as: 'images'
        })

        .lookup({
            from: 'users',
            localField: 'developer',
            foreignField: '_id',
            // $unset: ["password"],
            as: 'developer'
        })

        .project({
            'developer.password': 0,
            'developer.email': 0,
        })
        // .unset('developer.password')

        properties.exec().then(result => {
            console.log('Features properties: ', result)
            return res.send(result)
        })
  

    } catch (error) {
        console.warn('Error: ', error)
        res.send({status: 'error', msg: error})
    }
}

exports.getSinglePropertyForHome = async (req, res) => {

    const id = req.params.id

    console.log('Property ID: ', id)

    try {

        const property = Property.aggregate()

        
        .match({ _id: mongoose.Types.ObjectId(id) })
        
        .lookup({
            from: 'files',
            localField: 'image',
            foreignField: '_id',
            as: 'image'
        })
        
        .lookup({
            from: 'files',
            localField: 'images',
            foreignField: '_id',
            as: 'images'
        })

        .lookup({
            from: 'files',
            localField: 'floorplanImage',
            foreignField: '_id',
            // $unset: ["password"],
            as: 'floorplanImage'
        })
        
        
        .lookup({
            from: 'users',
            localField: 'developer',
            foreignField: '_id',
            // $unset: ["password"],
            as: 'developer'
        })


        
        // .project('-developer.password -developer.email -image.bucket')

        .project({
            'developer.password': 0,
            'developer.email': 0,
        })

        
        property.exec().then(result => {
            // result.project('-image.bucket')
            console.log('Single property: ', result)
            return res.send(result[0])
        })
  

    } catch (error) {
        console.warn('Error: ', error)
        res.send({status: 'error', msg: error})
    }
}