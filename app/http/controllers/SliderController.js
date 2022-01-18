// const {upload, destroy} = require('../../../helpers/cloudinary')
const Slider = require('../../models/Slider');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const Option = require('../../models/Option');
const Property = require('../../models/Property');
const Project = require('../../models/Project');


exports.saveSlider = async (req, res) => {

   // console.log(req.body)

   const token = req.headers.authorization

   const {
      name,
      property,
      project,
      background,
      sliderType
   } = req.body

   if (!token) return res.status(401).json({ type: 'error', msg: 'You are not allowed to do this action' })

   try {

      const data = jwt.verify(token, process.env.APP_SECRET);

      const user = await User.findOne({ _id: data.id })


      if (user && user.user_type == 'admin') {

         // console.log('Auth User ok?: ', user)
         // let img_url = ''

         // if (image) {

         // }

         // console.log(img_url)

         const slider = new Slider()
         slider.name = name
         slider.property = property
         slider.project = project
         slider.background = background
         slider.sliderType = sliderType

         // slider.title = title
         // slider.description = description
         // slider.image = img_url
         // slider.status = status
         // slider.hasButton = hasButton
         // slider.buttonName = buttonName
         // slider.buttonLink = buttonLink
         // slider.buttonBgColor = buttonBgColor
         // slider.buttonTextColor = buttonTextColor
         await slider.save()

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

exports.getSlider = async (req, res) => {

   try {

      const sliders = await Slider.find().populate([
         {
            path: 'property',
            Model: 'Property',
            populate: [{
               path: 'project',
               model: 'Project'
            }]
         },
         {
            path: 'project',
            model: 'Project'
         },

      ])

      // .limit(8)
      // console.log('Find Query: ', find)

      // const properties = await Property.find(find)

      return res.json({ status: 'success', sliders })

   } catch (error) {
      return res.json({ status: 'error', msg: error.message })
   }
}

exports.saveSliderStatus = async (req, res) => {

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

         option.slider = status

         await option.save()

         return res.json({ status: 'success', option })
      }


   } catch (error) {
      return res.json({ status: 'error', msg: error.message })
   }
}

exports.get_properties = async (req, res) => {

   const { propertyId } = req.body

   try {

      var find = {}

      if (propertyId) {
         find.pid = { $regex: propertyId, $options: 'i' }
      }
      // console.log('Query: ', find)

      const properties = await Property.find(find).populate([
         {
            path: 'image',
            Model: 'File'
         },
         {
            path: 'manager',
            Model: 'User'
         },

      ]).limit(8)
      // console.log('Find Query: ', find)

      // const properties = await Property.find(find)

      return res.json({ status: 'success', properties })

   } catch (error) {
      return res.json({ status: 'error', msg: error.message })
   }
}

exports.get_projects = async (req, res) => {

   const { projectQuery } = req.body

   try {

      var find = {}

      if (projectQuery) {
         find = {
            projectCode: { $regex: projectQuery, $options: 'i' }
         }
      }
      // console.log('Query: ', find)

      const projects = await Project.find(find).populate([
         {
            path: 'projectImage',
            Model: 'File'
         },
         {
            path: 'manager',
            Model: 'User'
         },

      ]).limit(8)
      // console.log('Find Query: ', find)

      // const projects = await Property.find(find)

      return res.json({ status: 'success', projects })

   } catch (error) {
      return res.json({ status: 'error', msg: error.message })
   }
}