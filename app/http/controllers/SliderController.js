const {upload, destroy} = require('../../../helpers/cloudinary')
const Slider = require('../../models/Slider')

exports.save = async (req, res) => {

   // console.log(req.body)

   try {

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
   
      let img_url = ''
   
      if(image) 
      {
         const uploadImage = await upload(image)

         console.log('upload: ',uploadImage)

         img_url = uploadImage.secure_url
      }

      // console.log(img_url)
   
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
       
      res.status(200).json({type: 'success', msg:'Slider saved successfully.'})
      
   } catch (error) {
      console.log(error.message)
      res.status(500).json({error: error.message})
   }
    
}

exports.getAll = async (req, res) => {
   try {
      const sliders = await Slider.find().sort({ _id: -1})
      // console.log('All sliders: ',sliders)
      res.status(200).json(sliders)
   } catch (error) {
      res.status(500).json({error: error.message})
   }
}

exports.getActive = async (req, res) => {
   try {
      const sliders = await Slider.find({status: 'active'}).sort({ _id: -1})
      // console.log('Active sliders: ',sliders)
      res.status(200).json(sliders)
   } catch (error) {
      res.status(500).json({error: error.message})
   }
}


exports.getRandomOne = async (req, res) => {
   try {

      const slider = await Slider.aggregate([
         { $sample: { size: 1 } }
      ])

      // console.log('Active sliders: ',slider)
      res.status(200).json(slider)
   } catch (error) {
      res.status(500).json({error: error.message})
   }
}

exports.getByID = async(req, res) => {
   
   try {
      const slider = await Slider.findById(req.params.id)
      res.status(200).json(slider)
   } catch (error) {
      res.status(500).json({error: error.message})
   }

}

exports.saveByID = async (req, res) => {

   try {

      const {
         id,
         name,
         title,
         description,
         image,
         image_url,
         status,
         hasButton,
         buttonName,
         buttonLink,
         buttonBgColor,
         buttonTextColor
      } = req.body

         
      let img_url = ''
   
      if(image != '') 
      {

         console.log('Should destroy...')

         await destroy(image_url, 'sliders')

         const uploadImage = await upload(image)

         console.log('new upload: ', uploadImage)

         img_url = uploadImage.secure_url
      }
      else{
         img_url = image_url
      }

      console.log('Image - URL: ',img_url)

      await Slider.findByIdAndUpdate(id,{
         name: name,
         title: title,
         description: description,
         image: img_url,
         status: status,
         hasButton: hasButton,
         buttonName: buttonName,
         buttonLink: buttonLink,
         buttonBgColor: buttonBgColor,
         buttonTextColor: buttonTextColor
      })

      res.status(200).json({type: 'success', msg:'Slider saved successfully.'})
      
   } catch (error) {
      res.status(500).json({error: error.message})
   }
}

exports.deleteByID = async (req, res) => {

  try {

   const slider = await Slider.findById(req.params.id)
   await destroy(slider.image, 'sliders')

   await Slider.findByIdAndDelete(req.params.id)

   return res.status(200).json({type: 'success', msg:'Slider deleted successfully.'})

  }catch(error) {
   res.json({type: 'error', msg:error.message})
  }

}