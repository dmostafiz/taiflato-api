const Project = require("../../models/Project")
const jwt = require('jsonwebtoken');
const User = require('../../models/User')
const mongoose = require('mongoose');
const Floor = require("../../models/Floor");
const Process = require("../../models/Process");

exports.getAllProjects = async (req, res) => {
    try {

        const projects = await Project.find({ 'status': { $ne: 'drafted' } })
            .populate([
                {
                    path: 'projectImage',
                    model: 'File'
                },
                {
                    path: 'manager',
                    model: 'User'
                },
                {
                    path: 'developer',
                    model: 'User'
                },
                {
                    path: 'company',
                    model: 'Company'
                },
            ])

        // console.log('Admin projects: ', projects)

        return res.json({ status: 'success', projects: projects })


    } catch (error) {

        console.log('Error Occured:', error.message)

        return res.json({ status: 'error', msg: error.message })

    }
}

exports.projectDetails = async (req, res) => {

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
                    path: 'properties',
                    model: 'Property'
                },

                {
                    path: 'manager',
                    model: 'User'
                },
                {
                    path: 'developer',
                    model: 'User'
                },
                {
                    path: 'company',
                    model: 'Company'
                },
            ])

        // console.log('Admin project: ', project)

        return res.json({ status: 'success', project: project })


    } catch (error) {

        console.log('Error Occured:', error.message)

        return res.json({ status: 'error', msg: error.message })

    }
}

exports.getIsrapolyMembers = async (req, res) => {
    try {

        const users = await User.find({
            account_verified: true,
            dashboard: 'buyer'
        })

        return res.json({ status: 'success', users })

    } catch (error) {
        // console.log('Error: ', error.message)
        console.log('Error Occured:', error.message)

        return res.json({ status: 'error', msg: error.message })
    }
}

exports.getRealestateDevelopers = async (req, res) => {
    try {

        const users = await User.find({
            account_verified: true,
            dashboard: 'developer',
            is_realestate_admin: true
        })

        return res.json({ status: 'success', users })

    } catch (error) {
        // console.log('Error: ', error.message)
        console.log('Error Occured:', error.message)

        return res.json({ status: 'error', msg: error.message })
    }
}

exports.get_developer_details = async (req, res) => {
    const developerId = req.params.id

    try {

        const user = await User.findById(developerId)
            .populate([
                {
                    path: 'profile',
                    model: 'Profile'
                },
                {
                    path: 'projects',
                    model: 'Project',
                    populate: [
                        {
                            path: 'projectImage',
                            model: 'File'
                        }
                    ]
                },
                {
                    path: 'properties',
                    model: 'Property',
                    populate: [
                        {
                            path: 'image',
                            model: 'File'
                        }
                    ]
                }
            ])

        return res.json({ status: 'success', user })

    } catch (error) {
        console.log('Error Ocurred: ', error.message);
        res.json({ status: 'error', msg: error.message })
    }
}

exports.getAllPendingSales = async (req, res) => {
    const token = req.headers.authorization

    console.log('Token: ', token)
    try {

        const data = jwt.verify(token, process.env.APP_SECRET)

        const user = await User.findOne({ _id: data.id })

        if (user) {

            const processProperties = await Process.find().populate([
                {
                    path: 'property',
                    model: 'Property',
                    populate: [{
                        path: 'image',
                        model: 'File'
                    },
                    {
                        path: 'project',
                        model: 'Project'
                    }
                    ]
                }
            ])

            // console.log('Process: ', processProperties)

            res.json({ status: 'success', processProperties })
        }

    } catch (error) {
        // console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}
