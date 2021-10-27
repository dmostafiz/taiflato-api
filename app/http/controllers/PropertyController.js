const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Property = require('../../models/Property');
const mongoose = require('mongoose')


exports.filterSearch = (req, res) => {


  // console.log('Filter Queary: ', req.query.district.split(','))

  try {
    
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
              properties.match({ propertySize: {
                  $gte: parseInt(req.query.surface_from),
                  $lte: parseInt(req.query.surface_to)
              } })
            }

            if (req.query.price_from && req.query.price_to) {
              properties.match({ price: {
                  $gte: parseInt(req.query.price_from),
                  $lte: parseInt(req.query.price_to)
              } })
            }

            if (req.query.delivery_from && req.query.delivery_to) {
              properties.match({ readyTime: {
                  $gte: parseInt(req.query.delivery_from),
                  $lte: parseInt(req.query.delivery_to)
              } })
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
                district : { $in: req.query.district.split(',') }
                  
              })
            }

            // properties.exec().then( result => {
            //     // console.log('Searched Properties: ', result)
            //     res.send({status:'success', result})
            // })

            const options = {
              page: req.query.page ? req.query.page : 1,
              limit: 9,
            };

            Property.aggregatePaginate(properties, options)
            .then(function (result) {
              // console.log("Pagination result: ", result);
              res.send({status:'success', result})

            })
    
  } catch (error) {
    res.send({status:'error', messagle:error.msg})
  }
}

exports.saveProperty = async (req, res) => {


  console.log("Property Data: ", req.body)

  const token = req.headers.authorization
  console.log('Server Token:', token)

  const {
    title,
    propertyType,
    propertySize,
    propertyPrice,
    bedroomNumber,
    bathroomNumber,
    floor,
    additionalDetails,
    features,
    country,
    district,
    city,
    zip,
    address,
    willReadyForSale,
    latitude,
    longitude,
    description,
    nearby,
    virtualTour

  } = req.body


  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const date = Date.now().toString()
      const pid = date.substr(-6)

      // console.log('User: ',user)
      const property = new Property()
      property.pid = pid
      property.title = title
      property.propertyType = propertyType
      property.propertySize = propertySize
      property.price = propertyPrice
      property.bedroom = bedroomNumber
      property.bathroom = bathroomNumber
      property.floor = floor
      property.additionalDetails = additionalDetails
      property.features = features
      property.country = country
      property.district = district
      property.city = city
      property.zip = zip
      property.address = address
      property.latitude = latitude
      property.longitude = longitude
      property.readyTime = willReadyForSale
      property.description = description
      property.nearby = nearby
      property.virtualTourLink = virtualTour
      property.developer = user._id

      await property.save()

      // console.log(property)

      res.json(property)
    }

  } catch (error) {
      res.json({status:'error', msg:error.message})
  }

}

exports.actionProperty = async (req, res) => {

  const token = req.headers.authorization

  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    const {id, action_type} = req.body

    if (user) {
       
      // console.log("Request body: ", req.body)

      if(action_type == 'approve' && user.user_type == 'admin'){

        const property = await Property.findOne({_id: id})

        if(property){

          property.status = 'published'

          await property.save()

          return res.json({status:'success', property})
        }
        else{

          return res.json({status: 'error', msg: 'property not found'})
       
        }

        
      }
      else{
        
        return res.json({status: 'error', msg: 'You are not authourised to do this action'})
      
      }  
      
    }
    
    else{

      return res.json({status: 'error', msg: 'You are not authourised to do this action'})
    
    }

  } catch (error) {
    console.log('Error: ', error)
    return res.json({status: 'error', msg: error})
  }
}

exports.getMyProperty = async (req, res) => {

  console.log("My Query String: ", req.query)


  const token = req.headers.authorization

  try {

    // console.log("Token: ", token)

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    // console.log("I Am: ", user)

    if (user) {

      const properties = Property.aggregate()

        .match({ developer: user._id })

        .sort({ "createdAt": -1})

        // .sample({ size: 3 })

        // .limit(20)

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

      if (req.query.status && req.query.status != 'all') {
        properties.match({ status: req.query.status })
      }

      if (req.query.q) {
        // properties.match({title: req.query.q})
        properties.match({
          $or: [
            { title: { $regex: req.query.q, $options: 'i' } },
            { pid: { $regex: req.query.q, $options: 'i' } }
          ]
        })
      }


      properties.exec().then(result => {
        // result has your... results
        // console.log("My Properties: ", result)

        res.json(result)
      });

    }

  } catch (error) {
    return res.json(error)
  }
}

exports.getSingleProperty = async (req, res) => {

  const id = req.params.id

  // console.log('Property ID: ', id)

  try {

    const property = await Property.findOne({ _id: id })
    .populate(
      [
        {
          path: 'image',
          model: 'File',
        },
        {
          path:'images',
          model: 'File',
        },
        {
          path:'floorplanImage',
          model: 'File',
        },
        {
          path: 'developer',
          model: 'User',
          select: { 'password': 0 },
        },

      ]
    )
    // .aggregate()

      // .match({ _id: mongoose.Types.ObjectId(id) })

      // .lookup({
      //   from: 'files',
      //   localField: 'image',
      //   foreignField: '_id',
      //   as: 'image'
      // })

      // .lookup({
      //   from: 'files',
      //   localField: 'floorplanImage',
      //   foreignField: '_id',
      //   as: 'floorplanImage'
      // })

      // .lookup({
      //   from: 'files',
      //   localField: 'images',
      //   foreignField: '_id',
      //   as: 'images'
      // })

      // .lookup({
      //   from: 'users',
      //   localField: 'developer',
      //   foreignField: '_id',
      //   as: 'developer'
      // })
      
    // .lookup({
    //   fr
    // })

    // console.log("My Property: ", property)
    return res.json(property)

    // property.exec().then(result => {
    //   // console.log("My Property: ", result.length ? result[0] : {})

    //   return res.json(result.length ? result[0] : null)
    // })

  } catch (error) {
    return res.json({ status: 'error', msg: error })
  }

  // return res.json({})
}

exports.getAllProperty = async (req, res) => {
  // console.log("My Query String: ", req.query)

  try {

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

    if (req.query.status && req.query.status != 'all') {
      properties.match({ status: req.query.status })
    }

    if (req.query.q) {
      // properties.match({title: req.query.q})
      properties.match({
        $or: [
          { title: { $regex: req.query.q, $options: 'i' } },
          { pid: { $regex: req.query.q, $options: 'i' } }
        ]
      })
    }


    properties.exec().then(result => {
      // result has your... results
      // console.log("All Properties: ", result)

      return res.json(result)
    });

  } catch (error) {

    return res.json(error)

  }
}

exports.getPendingProperty = async (req, res) => {

  try {

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

      properties.match({ status: 'pending' })

    if (req.query.q) {
      // properties.match({title: req.query.q})
      properties.match({
        $or: [
          { title: { $regex: req.query.q, $options: 'i' } },
          { pid: { $regex: req.query.q, $options: 'i' } }
        ]
      })
    }


    properties.exec().then(result => {
      // result has your... results
      // console.log("My Properties: ", result)

      res.json(result)
    });

  } catch (error) {
    return res.json(error)
  }
}