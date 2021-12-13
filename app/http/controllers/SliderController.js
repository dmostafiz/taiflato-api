// const {upload, destroy} = require('../../../helpers/cloudinary')
const Slider = require('../../models/Slider');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const Option = require('../../models/Option');


exports.saveSlider = async (req, res) => {

   // console.log(req.body)

   const token = req.headers.authorization

   const {
      name,
      title,
      description,
      image,
      status,
      hasButton,
      buttonName,
      buttonLink,
      buttonBgColor,
      buttonTextColor
   } = req.body

   if (!token) return res.status(401).json({ type: 'error', msg: 'You are not allowed to do this action' })

   try {

      const data = jwt.verify(token, process.env.APP_SECRET);

      const user = await User.findOne({ _id: data.id })

      if (user && user.user_type == 'admin') {

         let img_url = ''

         if (image) {

         }

         console.log(img_url)

         const slider = new Slider()
         slider.name = name
         slider.title = title
         slider.description = description
         slider.image = img_url
         slider.status = status
         slider.hasButton = hasButton
         slider.buttonName = buttonName
         slider.buttonLink = buttonLink
         slider.buttonBgColor = buttonBgColor
         slider.buttonTextColor = buttonTextColor
         await slider.save()

         // console.log('Saved Slider =', slider)

         res.status(200).json({ type: 'success', msg: 'Slider saved successfully.' })



      } else {
         return res.status(401).json({ type: 'error', msg: 'You are not allowed to do this action' })
      }

   } catch (error) {
      res.json({ type: 'error', msg: 'You are not allowed to do this action' })
   }


}

exports.saveSliderStatus = async (req, res) => {

   const token = req.headers.authorization

   const {
      status
   } = req.body

   console.log('Slider Status: ', status)

   if (!token) return res.status(401).json({ type: 'error', msg: 'You are not allowed to do this action' })

   try {

      const data = jwt.verify(token, process.env.APP_SECRET);

      const user = await User.findOne({ _id: data.id })

      
      
      
      if (user && user.user_type == 'admin') {
         
         // console.log('Slider user.type: ', user.user_type)

         const option = await Option.findOne()

         console.log('Slider option: ', option)

         option.slider = status 

         await option.save()

         return res.json({ status: 'success', option })
      }


   } catch (error) {
      return res.json({ status: 'error', msg: error.message })
   }
}
