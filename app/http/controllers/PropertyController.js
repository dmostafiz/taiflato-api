const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Property = require('../../models/Property');
const mongoose = require('mongoose')


exports.saveProperty = async (req, res) => {

  // console.log("Property Data: ", req.body)

  const token = req.headers.authorization
  console.log('Server Token:', token)

  const {
    title,
    propertyType,
    propertySize,
    propertyPrice,
    bedroomNumber,
    bathroomNumber,
    garageSize,
    additionalDetails,
    features,
    country,
    district,
    city,
    zip,
    address,
    saleStatus,
    willReadyForSale,
    investPrice,
    latitude,
    longitude,
    description,
    nearby,
    virtualTour

  } = req.body


  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({_id: data.id})
 
    if(user) {

      const date = Date.now().toString()
      const pid = date.substr(-6)
      
      // console.log('User: ',user)
      const property = new Property()
      property.propertyId = pid
      property.title = title
      property.propertyType = propertyType
      property.propertySize = propertySize
      property.price = propertyPrice
      property.bedroom = bedroomNumber
      property.bathroom = bathroomNumber
      property.garageSize = garageSize
      property.additionalDetails = additionalDetails
      property.features = features
      property.country = country
      property.district = district
      property.city = city
      property.zip = zip
      property.address = address
      property.latitude = latitude
      property.longitude = longitude
      property.saleStatus = saleStatus
      property.readyTime = willReadyForSale
      property.investPrice = investPrice
      property.description = description
      property.nearby = nearby
      property.virtualTourLink = virtualTour
      property.developer = user._id

      await property.save()

      console.log(property)

      res.json(property)
    }
    
  } catch (error) {
    
  }

}

exports.getMyProperty = async (req, res) => {

  console.log("My Query String: ", req.query)


  const token = req.headers.authorization

  try {
    
    // console.log("Token: ", token)

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({_id: data.id})

    // console.log("I Am: ", user)

    if(user){

      const properties = Property.aggregate()

      .match({developer: user._id})

      .lookup({
          from: 'files',
          localField: 'image',
          foreignField: '_id',
          as: 'image'
      })

      .lookup( {
        from: 'files',
        localField: 'images',
        foreignField: '_id',
        as: 'images'
      })

      if(req.query.status && req.query.status != 'all'){
        properties.match({status: req.query.status})
      }

      if(req.query.q){
        // properties.match({title: req.query.q})
        properties.match({
          $or: [ 
            { title: {$regex: req.query.q, $options: 'i'} }, 
            { propertyId: {$regex: req.query.q, $options: 'i'} } 
          ] 
        })
      }


      properties.exec().then(result => {
        // result has your... results
        console.log("My Properties: ", result)
  
        res.json(result)
      });

    }

  } catch (error) {
    
  }
}

exports.getSingleProperty = async (req, res) => {

  const id = req.params.id

  console.log('Property ID: ', id)

  try {

    const property = Property.aggregate()

                        .match({_id: mongoose.Types.ObjectId(id)})

                        .lookup({
                          from: 'files',
                          localField: 'image',
                          foreignField: '_id',
                          as:'image'
                        })

                        .lookup({
                          from: 'files',
                          localField: 'floorplanImage',
                          foreignField: '_id',
                          as:'floorplanImage'
                        })
                        
                        .lookup({
                          from:'files',
                          localField:'images',
                          foreignField:'_id',
                          as:'images'
                        })
                        // .lookup({
                        //   fr
                        // })
            property.exec().then(result => {
              // console.log("My Property: ", result.length ? result[0] : {})
  
              return res.json(result.length ? result[0] : null)
            })
    
  } catch (error) {
    return res.json({status: 'error', msg: error})
  }

  // return res.json({})
}