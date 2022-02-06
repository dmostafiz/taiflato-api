const jwt = require('jsonwebtoken');
const User = require('../../models/User');
// const Project = require('../../models/Building');
const mongoose = require('mongoose');
const Floor = require('../../models/Floor');
// const Building = require('../../models/BuildingPlan');
const BuildingPlan = require('../../models/BuildingPlan');
const Project = require('../../models/Project');


exports.getBuildingPlan = async (req, res) => {

  const projectId = req.params.projectId


  try {

    var buildingPlan = await BuildingPlan.findOne({ project: projectId }) 
    
    if(!buildingPlan){
      const plan = new BuildingPlan()
      plan.project = projectId
      await plan.save()

      await Project.findByIdAndUpdate(projectId, {
        $set:{plan: plan._id}
      })

      console.log('New Plan: ', plan);

      buildingPlan = plan
    }
    
    console.log('Building Plan: ', buildingPlan );


    return res.json({ status: 'success', buildingPlan })

  } catch (error) {
    console.log('Error occured: ', error.message);
    res.json({ status: 'error', msg: error.message })
  }

}

exports.saveBuildingPlan = async (req, res) => {

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
    imgDimensions
  } = req.body


  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    if (user) {


    }

  } catch (error) {

  }

}

exports.actionBuildingPlans = async (req, res) => {

  const token = req.headers.authorization

  try {
    const data = jwt.verify(token, process.env.APP_SECRET)

    const user = await User.findOne({ _id: data.id })

    const { id, action_type } = req.body

    if (user) {

      // console.log("Request body: ", req.body)

      if (action_type == 'approve' && user.user_type == 'admin') {

        const building = await Building.findOne({ _id: id })

        if (building) {

          building.status = 'published'

          await building.save()

          return res.json({ status: 'success', building })
        }
        else {

          return res.json({ status: 'error', msg: 'property not found' })

        }


      }
      else {

        return res.json({ status: 'error', msg: 'You are not authourised to do this action' })

      }

    }

    else {

      return res.json({ status: 'error', msg: 'You are not authourised to do this action' })

    }

  } catch (error) {
    console.log('Error: ', error)
    return res.json({ status: 'error', msg: error })
  }
}

exports.getMyBuildingsPlans = async (req, res) => {

  console.log("My Query String: ", req.query)


  const token = req.headers.authorization

  try {

    // console.log("Token: ", token)

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    // console.log("I Am: ", user)

    if (user) {

      const buildings = Building.aggregate()

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
        buildings.match({ status: req.query.status })
      }

      if (req.query.q) {
        // buildings.match({title: req.query.q})
        buildings.match({
          $or: [
            { title: { $regex: req.query.q, $options: 'i' } },
            { pid: { $regex: req.query.q, $options: 'i' } }
          ]
        })
      }


      buildings.exec().then(result => {
        // result has your... results
        console.log("My Properties: ", result)

        res.json(result)
      });

    }

  } catch (error) {
    return res.json(error)
  }
}

exports.getBuildingPlansById = async (req, res) => {

  const id = req.params.id

  console.log('Project ID: ', id)

  try {

    const building = Building.aggregate()

      .match({ _id: mongoose.Types.ObjectId(id) })

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

      .lookup({
        from: 'floors',
        localField: 'floors',
        foreignField: '_id',
        as: 'floors',
      })

    // .lookup({
    //   from: 'files',
    //   localField: 'images',
    //   foreignField: '_id',
    //   as: 'images'
    // })
    // .lookup({
    //   fr
    // })
    building.exec().then(result => {

      // console.log("My Building: ", result.length ? result[0] : {})

      return res.json(result.length ? result[0] : null)

    })

  } catch (error) {
    return res.json({ status: 'error', msg: error })
  }

  // return res.json({})
}

exports.getAllBuildingPlans = async (req, res) => {
  // console.log("My Query String: ", req.query)

  try {

    const buildings = Building.aggregate()

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

      .lookup({
        from: 'users',
        localField: 'developer',
        foreignField: '_id',
        as: 'developer'
      })

    if (req.query.status && req.query.status != 'all') {
      buildings.match({ status: req.query.status })
    }

    if (req.query.q) {
      // buildings.match({title: req.query.q})
      buildings.match({
        $or: [
          { title: { $regex: req.query.q, $options: 'i' } },
          { pid: { $regex: req.query.q, $options: 'i' } }
        ]
      })
    }


    buildings.exec().then(result => {
      // result has your... results
      console.log("All Properties: ", result)

      return res.json(result)
    });

  } catch (error) {

    return res.json(error)

  }
}

exports.getPendingBuildingPlans = async (req, res) => {

  try {

    const buildings = Building.aggregate()

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

      .lookup({
        from: 'users',
        localField: 'developer',
        foreignField: '_id',
        as: 'developer'
      })

    buildings.match({ status: 'pending' })

    if (req.query.q) {
      // buildings.match({title: req.query.q})
      buildings.match({
        $or: [
          { title: { $regex: req.query.q, $options: 'i' } },
          { pid: { $regex: req.query.q, $options: 'i' } }
        ]
      })
    }


    buildings.exec().then(result => {
      // result has your... results
      console.log("My Properties: ", result)

      res.json(result)
    });

  } catch (error) {
    return res.json(error)
  }
}

exports.getFloorById = async (req, res) => {

  const id = req.params.id

  console.log('Floor ID: ', req.params.id)

  try {

    const floor = Floor.aggregate()

      .match({ _id: mongoose.Types.ObjectId(id) })

      .lookup({
        from: 'files',
        localField: 'image',
        foreignField: '_id',
        as: 'image'
      })

      .lookup({
        from: 'buildings',
        localField: 'building',
        foreignField: '_id',
        as: 'building',
      })

    // .lookup({
    //   from: 'files',
    //   localField: 'images',
    //   foreignField: '_id',
    //   as: 'images'
    // })
    // .lookup({
    //   fr
    // })
    floor.exec().then(result => {

      console.log("My Floor: ", result.length ? result[0] : {})

      return res.json(result.length ? result[0] : null)

    })

  } catch (error) {
    return res.json({ status: 'error', msg: error })
  }

  // return res.json({})
}

exports.saveFloor = async (req, res) => {

  const { pid, floorNo, coordinates } = req.body
  // return res.json({pid, floorNo, coordinates})

  console.log('Project ID: ', pid)
  const token = req.headers.authorization

  try {

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    console.log('User: ', user)

    // return

    if (user) {

      const floor = new Floor()
      floor.floorNo = floorNo
      floor.coordinates = coordinates
      floor.building = pid
      floor.developer = user._id
      await floor.save()

      const building = await Building.findById(pid)
      building.floors = [...building.floors, floor._id]
      await building.save()

      res.json({ status: 'success', message: 'Floor added successfully.', floorData: floor })

    }
    else {
      res.json({ status: 'error', message: 'You are not authorised to do this action' })
    }


  } catch (error) {
    return res.json({ status: 'error', msg: error })
  }

  // return res.json({})
}

exports.saveApartment = async (req, res) => {

  const { fid, floorNo, coordinates } = req.body
  // return res.json({fid, floorNo, coordinates})

  console.log('Project ID: ', fid)
  const token = req.headers.authorization

  try {

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    console.log('User: ', user)

    // return

    if (user) {

      const floor = await Floor.findById(fid)


      floor.properties = [...floor.properties, req.body]

      await floor.save()

      console.log('Floor Added: ', floor)

      // return

      res.json({ status: 'success', message: 'Apartment added successfully.', floorData: floor })

    }
    else {
      res.json({ status: 'error', message: 'You are not authorised to do this action' })
    }


  } catch (error) {
    return res.json({ status: 'error', msg: error })
  }

  // return res.json({})
}
