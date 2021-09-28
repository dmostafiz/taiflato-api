const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Project = require('../../models/Project');
const mongoose = require('mongoose')


exports.filterSearch = (req, res) => {
  try {
    const properties = Project.aggregate()
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

    properties.exec().then( result => {
        console.log('Searched Properties: ', result)
        res.send({status:'success', result})
    })
    
  } catch (error) {
    res.send({status:'error', messagle:error.msg})
  }
}

exports.saveProject = async (req, res) => {


  // console.log("Property Data: ", req.body)

  const token = req.headers.authorization
  console.log('Server Token:', token)

  const {
    title,
    country,
    district,
    city,
    zip,
    address,
    latitude,
    longitude,
    buildTime,
    readyTime,
    description,

  } = req.body


  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const date = Date.now().toString()
      const pid = date.substr(-6)

      // console.log('User: ',user)
      const property = new Project()
      property.pid = pid
      property.title = title
      property.garageSize = garageSize
      property.features = features
      property.country = country
      property.district = district
      property.city = city
      property.zip = zip
      property.address = address
      property.latitude = latitude
      property.longitude = longitude
      property.saleStatus = saleStatus
      property.buildTime = buildTime
      property.readyTime = readyTime
      property.description = description
      property.developer = user._id

      await property.save()

      // console.log(property)

      res.json(property)
    }

  } catch (error) {

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
        console.log("My Properties: ", result)

        res.json(result)
      });

    }

  } catch (error) {
    return res.json(error)
  }
}

exports.getSingleProperty = async (req, res) => {

  const id = req.params.id

  console.log('Property ID: ', id)

  try {

    const property = Property.aggregate()

      .match({ _id: mongoose.Types.ObjectId(id) })

      .lookup({
        from: 'files',
        localField: 'image',
        foreignField: '_id',
        as: 'image'
      })

      .lookup({
        from: 'files',
        localField: 'floorplanImage',
        foreignField: '_id',
        as: 'floorplanImage'
      })

      .lookup({
        from: 'files',
        localField: 'images',
        foreignField: '_id',
        as: 'images'
      })
    // .lookup({
    //   fr
    // })
    property.exec().then(result => {
      // console.log("My Property: ", result.length ? result[0] : {})

      return res.json(result.length ? result[0] : null)
    })

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
      console.log("All Properties: ", result)

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
      console.log("My Properties: ", result)

      res.json(result)
    });

  } catch (error) {
    return res.json(error)
  }
}