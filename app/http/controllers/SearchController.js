const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Property = require('../../models/Property');
const mongoose = require('mongoose');
const Project = require('../../models/Project');


exports.filterSearch = async (req, res) => {


    //console.log('Filter Queary: ', req.query.district.split(','))

    try {


        var query = {}

        // if (req.query.surface_from && req.query.surface_to) {

        //     query = {
        //         sizes: { $in: [parseInt(req.query.surface_from)] },
        //         // $and: [
        //         //     {
        //         //         // members:{ $in: [mongoose.Types.ObjectId(user._id)]},  
        //         //         sizes: { $in: [parseInt(req.query.surface_to)] }
        //         //     }
        //         // ]
        //     }
        // }

        const optionsss = {
            // select: 'title date author',
            sort: { date: -1 },
            populate: [
                {
                    path: 'developer',
                    model: 'User'
                },

                {
                    path: 'projectImage',
                    model: 'File'
                }
            ],
            // lean: true,
            // offset: 1,
            // limit: 2,

            page: req.query.page ? req.query.page : 1,
            limit: 6,
        }

        const projectResult = await Project.paginate(query, optionsss)

        console.log('Paginated projectResult: ', projectResult)
        // const projectResult = Project.find()
        return res.send({ status: 'success', projectResult })


    } catch (error) {
        console.log('Error Occured:', error.message)

        res.send({ status: 'error', messagle: error.msg })
    }
}
