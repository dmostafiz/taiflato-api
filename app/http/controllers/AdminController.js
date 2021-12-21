const Project = require("../../models/Project")
const jwt = require('jsonwebtoken');
const User = require('../../models/User')
const mongoose = require('mongoose')

exports.getAllProjects = async (req, res) => {
    try {

        const projects = await Project.find({'status': {$ne:  'drafted'}})
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

        console.log('Admin projects: ', projects)

        return res.json({ status: 'success', projects: projects })


    } catch (error) {

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

        console.log('Admin project: ', project)

        return res.json({ status: 'success', project: project })


    } catch (error) {

        return res.json({ status: 'error', msg: error.message })

    }
}
