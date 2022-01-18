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

        return res.json({status: 'success', users})

    } catch (error) {
        // console.log('Error: ', error.message)
        console.log('Error Occured:', error.message)

        return res.json({status: 'error', msg: error.message})
    }
}

exports.getRealestateDevelopers = async (req, res) => {
    try {
        
        const users = await User.find({
            account_verified: true,
            dashboard: 'developer',
            is_realestate_admin: true
        })

        return res.json({status: 'success', users})

    } catch (error) {
        // console.log('Error: ', error.message)
        console.log('Error Occured:', error.message)

        return res.json({status: 'error', msg: error.message})
    }
}