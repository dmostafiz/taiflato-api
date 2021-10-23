const jwt = require('jsonwebtoken');
const User = require('../../models/User');
// const Project = require('../../models/Building');
const mongoose = require('mongoose');
const Auction = require('../../models/Auction');
const Property = require('../../models/Property');
const Bid = require('../../models/Bid');

exports.saveAuction = async (req, res) => {
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

exports.myAuctions = async (req, res) => {

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

        .sort({ "updatedAt": -1 })

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
        // console.log("My promotions: ", result)

        res.json(result)
      });

    }

  } catch (error) {
    return res.json(error)
  }
}

exports.allAuctions = async (req, res) => {

  try {

    const promotions = Auction.aggregate()

      .sort({ "updatedAt": -1 })

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
      // console.log("All promotions: ", result)

      res.json(result)
    });



  } catch (error) {
    return res.json(error)
  }
}

exports.getSingleAuction = async (req, res) => {
  const id = req.params.id

  // console.log('Promotion ID: ', id)

  try {

    const auction = await Auction.findOne({ _id: id })

      .populate(
        [
          {
            path: 'property',
            model: 'Property',
          },
          {
            path: 'developer',
            model: 'User',
            select: { 'password': 0 },
          },
          {
            path: 'bids',
            model: 'Bid',
            options: { sort: { 'price': -1 } },
            populate: {
              path: 'buyer',
              model: 'User',
              select: { 'password': 0 },
            }

          },

        ]
      )


    // console.log("My auction: ", auction)

    return res.json(auction)


  } catch (error) {
    console.log('Aggr Error: ', error.message)
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
      // console.log("Auctioned properties: ", result)

      res.json(result)
    });



  } catch (error) {
    return res.json(error)
  }
}

exports.saveBid = async (req, res) => {
  const { auctionId, propertyId, propertyImage, developerId, price, text } = req.body
  // return res.json({fid, floorNo, coordinates})

  // console.log('Promotion Data: ', req.body)

  const token = req.headers.authorization

  try {

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    // console.log('User: ', user)

    // return

    if (user) {

      const date = Date.now().toString()
      const bidId = date.substr(-6)

      const bid = new Bid()
      bid.bid = bidId
      bid.developer = developerId
      bid.buyer = user._id
      bid.property = propertyId
      bid.propertyImage = propertyImage
      bid.auction = auctionId
      bid.price = price
      bid.text = text

      await bid.save()

      const auction = await Auction.findById(auctionId)
      if (auction) {
        auction.bids = [...auction.bids, bid._id]
        await auction.save()
      }

      // console.log('Bid: ', bid)

      res.json({ status: 'success', msg: 'Bid placed successfully.', bid: bid })

    }
    else {
      res.json({ status: 'error', msg: 'You are not authorised to do this action' })
    }


  } catch (error) {
    console.log('Error: ', error.message)
    return res.json({ status: 'error', msg: error.message })
  }

}
