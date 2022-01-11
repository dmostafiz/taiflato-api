const jwt = require('jsonwebtoken');
const Option = require('../../models/Option');
const mongoose = require('mongoose')

exports.getSystemOptions = async (req, res) => {
    try {

        let option = await Option.findOne()

        if(!option){
            option = new Option()
            option.slider = true
            option.selectedProperties = true
            await option.save()
        }
        
        return res.json({status: 'success', option})
    } catch (error) {
        return res.json({status:'error', msg:error.message})
    }
}

