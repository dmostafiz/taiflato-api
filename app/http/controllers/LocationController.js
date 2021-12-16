var mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const getCid = require('../../../helpers/getCid');
const Invite = require('../../models/Invite');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const District = require('../../models/District');
const City = require('../../models/City');

exports.saveDistrict = async (req, res) => {

    const { name } = req.body
    const token = req.headers.authorization

    try {

        const data = jwt.verify(token, process.env.APP_SECRET)
        const user = await User.findOne({ _id: data.id })

        if (user && user.user_type == 'admin') {
            const district = new District()
            district.name = name
            await district.save()
            return res.json({ status: 'success', district })
        }


    } catch (error) {
        return res.json({ status: 'error', msg: error.message })
    }
}


exports.saveCity = async (req, res) => {

    const { name } = req.body
    const token = req.headers.authorization

    try {
        const data = jwt.verify(token, process.env.APP_SECRET)
        const user = await User.findOne({ _id: data.id })

        if (user && user.user_type == 'admin') {
            const city = new City()
            city.name = name
            await city.save()
            return res.json({ status: 'success', city })
        }

    } catch (error) {
        return res.json({ status: 'error', msg: error.message })
    }
}


exports.getDistricts = async (req, res) => {
    try {

        const districts = await District.find()

        return res.json({ status: 'success', districts })

    } catch (error) {
        return res.json({ status: 'error', msg: error.message })
    }
}

exports.getCities = async (req, res) => {
    try {

        const cities = await City.find()

        return res.json({ status: 'success', cities })

    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}
