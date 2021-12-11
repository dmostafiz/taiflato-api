const mongoose = require('mongoose')
const Company = require('../../models/Company')
const Project = require('../../models/Project')
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
            .sort({ createdAt: -1 })
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
            // console.log('Features properties: ', result)
            return res.send(result)
        })


    } catch (error) {
        console.warn('Error: ', error)
        res.send({ status: 'error', msg: error })
    }
}

exports.getFeaturedProjects = async (req, res) => {
    try {
        const projects = await Project.find()
        .populate([
            {
                path: 'projectImage',
                model: 'File'
            },
            {
                path: 'manager',
                model: 'User'
            },
        ])
        .limit(4)

        console.log('Featured projects: ', projects)

        res.send({ status: 'success', projects })

    } catch (error) {
        console.warn('Error: ', error.message)
        res.send({ status: 'error', msg: error.message })
    }
}


exports.getHeroSliderProperties = async (req, res) => {

    try {

        const properties = Property.aggregate()
            // .pipeline([
            //     {
            //         developer: {
            //             password: -1
            //         }
            //     }
            // ])
            // .sort({createdAt:-1})
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
            // console.log('Features properties: ', result)
            return res.send(result)
        })


    } catch (error) {
        console.warn('Error: ', error)
        res.send({ status: 'error', msg: error })
    }
}

exports.getBestDealProperties = async (req, res) => {

    try {

        const properties = Property.aggregate()
            // .pipeline([
            //     {
            //         developer: {
            //             password: -1
            //         }
            //     }
            // ])
            // .sort({createdAt:-1})
            .limit(4)
            // .sample({ size: 2 })

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
            // console.log('Features properties: ', result)
            return res.send(result)
        })


    } catch (error) {
        console.warn('Error: ', error)
        res.send({ status: 'error', msg: error })
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
            // console.log('Single property: ', result)
            return res.send(result[0])
        })


    } catch (error) {
        console.warn('Error: ', error)
        res.send({ status: 'error', msg: error })
    }
}

exports.getCompanies = async (req, res) => {

    try {

        const companies = await Company.find()

        return res.json({ status: 'success', companies })

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.get_single_company = async (req, res) => {
    const id = req.params.companyId

    try {

        const company = await Company.findById(id)

        return res.json({ status: 'success', company })


    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.get_projects_by_company = async (req, res) => {
    const companyId = req.params.companyId

    try {

        const projects = await Project.find({ company: companyId })
            .populate([
                {
                    path: 'projectImage',
                    model: 'File'
                },
                {
                    path: 'manager',
                    model: 'User'
                }
            ])

        return res.json({ status: 'success', projects })


    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.get_single_project = async (req, res) => {
    const id = req.params.id

    try {
        const project = await Project.findById(id)
            .populate([
                {
                    path: 'projectImage',
                    model: 'File'
                }
            ])

        // console.log("project: ", project)

        return res.json({ status: 'success', project })

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: 'Something went wrong' })
    }
}