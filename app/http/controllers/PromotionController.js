const jwt = require('jsonwebtoken');
const User = require('../../models/User');
// const Project = require('../../models/Building');
const mongoose = require('mongoose');
const Auction = require('../../models/Auction');
const Property = require('../../models/Property');

exports.savePromotion = async (req, res) => {
  const { propetyId, propertyImage, promotionPrice, expirationDate } = req.body
  // return res.json({fid, floorNo, coordinates})

  console.log('Promotion Data: ', req.body)
  const token = req.headers.authorization

  try {

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    console.log('User: ', user)

    // return

    if (user) {

      const date = Date.now().toString()
      const aid = date.substr(-6)

      const auction = new Auction()
      auction.aid = aid
      auction.developer = user._id
      auction.property = propetyId,
        auction.propertyImage = propertyImage,
        auction.auctionPrice = promotionPrice,
        auction.expireAt = expirationDate,

        await auction.save()

      const property = await Property.findById(propetyId)
      if (property) {
        property.isPromoted = true
        await property.save()
      }

      console.log('property: ', property)

      // return

      res.json({ status: 'success', msg: 'Promotion created successfully.', promotion: auction })

    }
    else {
      res.json({ status: 'error', msg: 'You are not authorised to do this action' })
    }


  } catch (error) {
    console.log('Error: ', error.message)
    return res.json({ status: 'error', msg: error.message })
  }

}

exports.myPromotions = async (req, res) => {

  console.log("My Query String: ", req.query)


  const token = req.headers.authorization

  try {

    // console.log("Token: ", token)

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    // console.log("I Am: ", user)

    if (user) {

      const promotions = Auction.aggregate()

        .match({ developer: user._id })

        .sort({ "createdAt": -1 })

        // .sample({ size: 3 })

        // .limit(20)

        .lookup({
          from: 'properties',
          localField: 'property',
          foreignField: '_id',
          as: 'property'
        })

        .lookup({
          from: 'bids',
          localField: 'bids',
          foreignField: '_id',
          as: 'bids'
        })


      promotions.exec().then(result => {
        // result has your... results
        console.log("My promotions: ", result)

        res.json(result)
      });

    }

  } catch (error) {
    return res.json(error)
  }
}

exports.getSinglePromotion = async (req, res) => {
  const id = req.params.id

  console.log('Promotion ID: ', id)

  try {

    const auction = Auction.aggregate()

      .match({ _id: mongoose.Types.ObjectId(id) })

      .lookup({
        from: 'properties',
        localField: 'property',
        foreignField: '_id',
        as: 'property'
      })

      .lookup({
        from: 'users',
        localField: 'developer',
        foreignField: '_id',
        as: 'developer'
      })

      .lookup({
        from: 'bids',
        localField: 'bids',
        foreignField: '_id',
        as: 'bids'
      })
    // .lookup({
    //   fr
    // })
    auction.exec().then(result => {
      // console.log("My auction: ", result.length ? result[0] : {})

      return res.json(result.length ? result[0] : null)
    })

  } catch (error) {
    return res.json({ status: 'error', msg: error.message })
  }

  // return res.json({})
}

exports.auctionedProperties = async (req, res) => {
  try {


      const promotions = Auction.aggregate()

        .match({ status: 'running' })

        .sort({ "createdAt": -1 })

        // .sample({ size: 3 })

        // .limit(20)

        .lookup({
          from: 'properties',
          localField: 'property',
          foreignField: '_id',
          as: 'property'
        })

        .lookup({
          from: 'bids',
          localField: 'bids',
          foreignField: '_id',
          as: 'bids'
        })


      promotions.exec().then(result => {
        // result has your... results
        console.log("Auctioned properties: ", result)

        res.json(result)
      });

    

  } catch (error) {
    return res.json(error)
  }
}