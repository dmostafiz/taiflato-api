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



        const properties = Property.aggregate()
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
                as: 'developer'
            })

            .project({
                'developer.password': 0,
                'developer.email': 0,
            })

        if (req.query.surface_from && req.query.surface_to) {
            properties.match({
                propertySize: {
                    $gte: parseInt(req.query.surface_from),
                    $lte: parseInt(req.query.surface_to)
                }
            })
        }

        if (req.query.price_from && req.query.price_to) {
            properties.match({
                price: {
                    $gte: parseInt(req.query.price_from),
                    $lte: parseInt(req.query.price_to)
                }
            })
        }

        if (req.query.delivery_from && req.query.delivery_to) {
            properties.match({
                readyTime: {
                    $gte: parseInt(req.query.delivery_from),
                    $lte: parseInt(req.query.delivery_to)
                }
            })
        }

        if (req.query.city && req.query.city != 'Select city') {
            properties.match({ city: req.query.city })
        }

        if (req.query.bedroom && req.query.bedroom != 'Select bedrooms') {
            properties.match({ bedroom: parseInt(req.query.bedroom) })
        }

        if (req.query.bathroom && req.query.bathroom != 'Select bathrooms') {
            properties.match({ bathroom: parseInt(req.query.bathroom) })
        }

        if (req.query.floor && req.query.floor != 'Select floor') {
            properties.match({ floor: parseInt(req.query.floor) })
        }

        if (req.query.category && req.query.category != 'Select category') {
            properties.match({ propertyType: req.query.category })
        }

        if (req.query.keywords) {
            // properties.match({title: req.query.q})
            properties.match({
                $or: [
                    { pid: { $regex: req.query.keywords, $options: 'i' } },
                    { title: { $regex: req.query.keywords, $options: 'i' } },
                    { propertyType: { $regex: req.query.keywords, $options: 'i' } },
                    { price: parseInt(req.query.keywords) },
                    { country: { $regex: req.query.keywords, $options: 'i' } },
                    { district: { $regex: req.query.keywords, $options: 'i' } },
                    { city: { $regex: req.query.keywords, $options: 'i' } },
                    { zip: { $regex: req.query.keywords, $options: 'i' } },
                    { address: { $regex: req.query.keywords, $options: 'i' } },
                    { description: { $regex: req.query.keywords, $options: 'i' } }
                ]
            })
        }

        if (req.query.district) {

            properties.match({
                district: { $in: req.query.district.split(',') }

            })
        }

        // properties.exec().then( result => {
        //     //console.log('Searched Properties: ', result)
        //     res.send({status:'success', result})
        // })

        const options = {
            page: req.query.page ? req.query.page : 1,
            limit: 9,
        };

        Property.aggregatePaginate(properties, options)
            .then(function (result) {
                //console.log("Pagination result: ", result);
                res.send({ status: 'success', result })

            })

    } catch (error) {
        res.send({ status: 'error', messagle: error.msg })
    }
}
