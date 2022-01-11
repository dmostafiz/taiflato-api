const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const Option = require('../../models/Option');
const Property = require('../../models/Property');
const Project = require('../../models/Project');


exports.saveSelectedPropertiesStatus = async (req, res) => {

    const token = req.headers.authorization

    const {
        status
    } = req.body

    // console.log('Slider Status: ', status)

    if (!token) return res.status(401).json({ type: 'error', msg: 'You are not allowed to do this action' })

    try {

        const data = jwt.verify(token, process.env.APP_SECRET);

        const user = await User.findOne({ _id: data.id })


        if (user && user.user_type == 'admin') {

            // console.log('Slider user.type: ', user.user_type)

            const option = await Option.findOne()

            // console.log('Slider option: ', option)

            option.selectedProperties = status

            await option.save()

            return res.json({ status: 'success', option })
        }


    } catch (error) {
        return res.json({ status: 'error', msg: error.message })
    }
}


exports.save_selected_properties = async (req, res) => {

    // console.log(req.body)

    const token = req.headers.authorization

    const {
        properties,
    } = req.body

    if (!token) return res.status(401).json({ type: 'error', msg: 'You are not allowed to do this action' })

    try {

        const data = jwt.verify(token, process.env.APP_SECRET);

        const user = await User.findOne({ _id: data.id })


        if (user && user.user_type == 'admin') {


            properties.forEach(async pty => {
                const property = await Property.findById(pty)
                property.homePageSelected = true
                await property.save()
            });


            // console.log('Saved Slider =', slider)

            res.json({ status: 'success', msg: 'Slider saved successfully.' })

        } else {
            return res.json({ type: 'error', msg: 'You are not allowed to do this action' })
        }

    } catch (error) {
        // console.log(error.message)
        res.json({ type: 'error', msg: 'You are not allowed to do this action' })
    }


}


exports.getSelectedProperties = async (req, res) => {

    try {

        const properties = await Property.find({
            homePageSelected: true
        }).populate([
            {
                path: 'image',
                model: 'File'
            },
            {
                path: 'developer',
                model: 'User'
            }
        ])

        // .limit(8)
        // console.log('Find Query: ', find)

        // const properties = await Property.find(find)

        return res.json({ status: 'success', properties })

    } catch (error) {
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.remove_selected_property = async (req, res) => {

    // console.log(req.body)

    const token = req.headers.authorization

    const {
        propertyId,
    } = req.body

    if (!token) return res.status(401).json({ type: 'error', msg: 'You are not allowed to do this action' })

    try {

        const data = jwt.verify(token, process.env.APP_SECRET);

        const user = await User.findOne({ _id: data.id })


        if (user && user.user_type == 'admin') {



            const property = await Property.findById(propertyId)
            property.homePageSelected = false
            await property.save()


            const properties = await Property.find({
                homePageSelected: true
            }).populate([
                {
                    path: 'image',
                    model: 'File'
                },
                {
                    path: 'developer',
                    model: 'User'
                }
            ])

    
            return res.json({ status: 'success', properties })
    

        } else {
            return res.json({ type: 'error', msg: 'You are not allowed to do this action' })
        }

    } catch (error) {
        // console.log(error.message)
        res.json({ type: 'error', msg: 'You are not allowed to do this action' })
    }


}
