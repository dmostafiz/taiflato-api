const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Project = require('../../models/Project');
const mongoose = require('mongoose')


exports.filterSearch = (req, res) => {
  try {
    const projects = Project.aggregate()
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

    projects.exec().then( result => {
        console.log('Searched Properties: ', result)
        res.send({status:'success', result})
    })
    
  } catch (error) {
    res.send({status:'error', messagle:error.msg})
  }
}

exports.saveProject = async (req, res) => {

  // console.log("Project Data: ", req.body)
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
    buildingStartTime,
    buildingReadyTime,
    description,
  } = req.body


  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {

      const date = Date.now().toString()
      const pid = date.substr(-6)

      // console.log('User: ',user)
      const project = new Project()
      project.pid = pid
      project.title = title
      project.country = country
      project.district = district
      project.city = city
      project.zip = zip
      project.address = address
      project.latitude = latitude
      project.longitude = longitude
      project.buildingStartTime = buildingStartTime
      project.buildingReadyTime = buildingReadyTime
      project.description = description
      project.developer = user._id

      await project.save()

      // console.log(project)

      res.json(project)
    }

  } catch (error) {

  }

}

exports.actionProject = async (req, res) => {

  const token = req.headers.authorization

  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    const {id, action_type} = req.body

    if (user) {
       
      // console.log("Request body: ", req.body)

      if(action_type == 'approve' && user.user_type == 'admin'){

        const property = await Project.findOne({_id: id})

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

exports.getMyProjects = async (req, res) => {

  console.log("My Query String: ", req.query)


  const token = req.headers.authorization

  try {

    // console.log("Token: ", token)

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    // console.log("I Am: ", user)

    if (user) {

      const projects = Project.aggregate()

        .match({ developer: user._id })

        .sort({ "createdAt": -1 })

        // .limit(20)

        .lookup({
          from: 'files',
          localField: 'buildingImage',
          foreignField: '_id',
          as: 'buildingImage'
        })

        .lookup({
          from: 'files',
          localField: 'galleryImages',
          foreignField: '_id',
          as: 'galleryImages'
        })


      if (req.query.status && req.query.status != 'all') {
        projects.match({ status: req.query.status })
      }

      if (req.query.q) {
        // projects.match({title: req.query.q})
        projects.match({
          $or: [
            { title: { $regex: req.query.q, $options: 'i' } },
            { pid: { $regex: req.query.q, $options: 'i' } }
          ]
        })
      }


      projects.exec().then(result => {
        // result has your... results
        console.log("My Properties: ", result)

        res.json(result)
      });

    }

  } catch (error) {
    return res.json(error)
  }
}

exports.getSingleProject = async (req, res) => {

  const id = req.params.id

  console.log('Project ID: ', id)

  try {

    const property = Project.aggregate()

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
      // console.log("My Project: ", result.length ? result[0] : {})

      return res.json(result.length ? result[0] : null)
    })

  } catch (error) {
    return res.json({ status: 'error', msg: error })
  }

  // return res.json({})
}

exports.getAllProject = async (req, res) => {
  // console.log("My Query String: ", req.query)

  try {

    const projects = Project.aggregate()

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
      projects.match({ status: req.query.status })
    }

    if (req.query.q) {
      // projects.match({title: req.query.q})
      projects.match({
        $or: [
          { title: { $regex: req.query.q, $options: 'i' } },
          { pid: { $regex: req.query.q, $options: 'i' } }
        ]
      })
    }


    projects.exec().then(result => {
      // result has your... results
      console.log("All Properties: ", result)

      return res.json(result)
    });

  } catch (error) {

    return res.json(error)

  }
}

exports.getPendingProject = async (req, res) => {

  try {

    const projects = Project.aggregate()

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

      projects.match({ status: 'pending' })

    if (req.query.q) {
      // projects.match({title: req.query.q})
      projects.match({
        $or: [
          { title: { $regex: req.query.q, $options: 'i' } },
          { pid: { $regex: req.query.q, $options: 'i' } }
        ]
      })
    }


    projects.exec().then(result => {
      // result has your... results
      console.log("My Properties: ", result)

      res.json(result)
    });

  } catch (error) {
    return res.json(error)
  }
}