const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Property = require('../../models/Property');
const mongoose = require('mongoose');
const Project = require('../../models/Project');


exports.filterSearch = async (req, res) => {


    //console.log('Filter Queary: ', req.query.district.split(','))

    try {


        var query = {}

        if (req.query.city) {

            query = {
                city: req.query.city,
            }
        }

        // console.log('parseInt(req.query.keywords): ', parseInt(req.query.keywords) )


        if (req.query.keywords) {

            query = {
                $or: [ 
                    { city: req.query.keywords },
                    { projectTitle: {$regex: req.query.keywords, $options: 'i'}  },
                    { description: {$regex: req.query.keywords, $options: 'i'}  },
                    { projectCode: {$regex: req.query.keywords, $options: 'i'}  },
                    { address: {$regex: req.query.keywords, $options: 'i'}  },
                    { country: req.query.keywords },
                    { district: req.query.keywords },
                    { zip: {$regex: req.query.keywords, $options: 'i'}  },
                    { prices:  req.query.keywords },
                    { deliveryIn: !isNaN(req.query.keywords) && parseInt(req.query.keywords) }
                ]
            }
        }


        if (req.query.delivery_from && req.query.delivery_to) {
            query = {
                ...query,
                deliveryIn: { $gte: parseInt(req.query.delivery_from), $lte: parseInt(req.query.delivery_to) }
            }
        }

        if (req.query.surface_from && req.query.surface_to) {
            query = {
                ...query,
                sizes: { $gte: parseInt(req.query.surface_from), $lte: parseInt(req.query.surface_to) }
            }
        }


        if (req.query.price_from && req.query.price_to) {
            query = {
                ...query,
                prices: { $gte: parseInt(req.query.price_from), $lte: parseInt(req.query.price_to) }
            }
        }

        if (req.query.district) {

            var district = req.query.district.split(",");

            query = {
                ...query,
                district: { $in: district}
            }
        }

        if (req.query.category ) {
            query = {
                ...query,
                types: { $in: req.query.category }
            }
        }

        
        console.log('Search query: ', query)

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
                },

                {
                    path: 'properties',
                    model: 'Property'
                }
            ],
            // lean: true,
            // offset: 1,
            // limit: 2,

            page: req.query.page ? req.query.page : 1,
            limit: 6,
        }

        const projectResult = await Project.paginate(query, optionsss)

        // console.log('Paginated projectResult: ', projectResult)
        // const projectResult = Project.find()
        return res.send({ status: 'success', projectResult })


    } catch (error) {
        console.log('Error Occured:', error.message)

        res.send({ status: 'error', messagle: error.msg })
    }
}
