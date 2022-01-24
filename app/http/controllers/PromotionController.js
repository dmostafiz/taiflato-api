const jwt = require('jsonwebtoken');
const User = require('../../models/User');
// const Project = require('../../models/Building');
const mongoose = require('mongoose');
const Auction = require('../../models/Auction');
const Property = require('../../models/Property');
const Bid = require('../../models/Bid');
const Thread = require('../../models/Thread');
const getCid = require('../../../helpers/getCid');
const Request = require('../../models/Request');
const Negotiation = require('../../models/Negotiation');
const Notification = require('../../models/Notification');
const Process = require('../../models/Process');
const Message = require('../../models/Message');
const Promotion = require('../../models/Promotion');

exports.savePromotion = async (req, res) => {
  const { properties, reducedPrice, startDate, expirationDate } = req.body
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

      properties.map(async pty => {

        const property = await Property.findById(pty).populate([
          {
            path: 'image',
            model: 'File'
          }
        ])

        if (property) {

          let aid = date.substr(-6)

          const promotion = new Promotion()
          promotion.aid = aid
          promotion.developer = property.developer
          promotion.property = property._id
          promotion.propertyImage = property.image.location
          promotion.reducedPercent = parseInt(reducedPrice)
          promotion.promotionPrice = parseInt(parseInt(property.price) - 100 * parseInt(reducedPrice) / parseInt(property.price))
          promotion.startAt = startDate
          promotion.expireAt = expirationDate
          promotion.status = startDate ? 'pending' : 'running'
          await promotion.save()

          if (!startDate) {
            property.isPromoted = true
            property.promotion = promotion._id
            await property.save()
          }


          return property
        }


      })


      res.json({ status: 'success', msg: 'Promotion created successfully.' })

    }
    else {
      res.json({ status: 'error', msg: 'You are not authorised to do this action' })
    }


  } catch (error) {
    // console.log('Error: ', error.message)
    console.log('Error Occured! ', error.message);

    return res.json({ status: 'error', msg: error.message })
  }

}

exports.cancel_promotion = async (req, res) => {
  const { promotionId } = req.body
  // return res.json({fid, floorNo, coordinates})

  // console.log('Promotion Data: ', req.body)
  const token = req.headers.authorization

  try {

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    // console.log('User: ', user)

    // return

    if (user) {

      const promotion = await Promotion.findById(promotionId)

      promotion.status = 'cancelled'

      await promotion.save()

      const propery = await Property.findById(promotion.property._id)
      propery.isPromoted = false
      propery.promotion = null
      await propery.save()


      const promotions = await Promotion.find({ developer: user._id })

        .sort({ "createdAt": -1 })

        .populate([
          {
            path: 'property',
            model: 'Property',
          }
        ])


      return res.json({ status: 'success', promotions })

    }
    else {
      console.log('Error occured: ', error.message);
      res.json({ status: 'error', msg: 'You are not authorised to do this action' })
    }


  } catch (error) {
    // console.log('Error: ', error.message)
    console.log('Error Occured! ', error.message);

    return res.json({ status: 'error', msg: error.message })
  }

}

exports.myPromotions = async (req, res) => {

  // console.log("My Query String: ", req.query)


  const token = req.headers.authorization

  try {

    // console.log("Token: ", token)

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    // console.log("I Am: ", user)

    if (user) {

      const promotions = await Promotion.find({ developer: user._id })

        .sort({ "updatedAt": -1 })

        .populate([
          {
            path: 'property',
            model: 'Property',
          }
        ])


      return res.json({ status: 'success', promotions })

    }

  } catch (error) {
    console.log('Error occured: ', error.message);
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

  console.log('Promotion ID: ', id)

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
    // console.log('Aggr Error: ', error.message)
    return res.json({ status: 'error', msg: error.message })
  }

  // return res.json({})
}

exports.auctionedProperties = async (req, res) => {
  try {

    const auctions = await Auction.find({ status: 'running' })
      .populate([
        {
          path: 'property',
          model: 'Property'
        },
        {
          path: 'bids',
          model: 'Bid'
        }
      ])

    return res.json({ status: 'success', auctions: auctions })

    // const promotions = Auction.aggregate()

    //   .match({ status: 'running' })

    //   .sort({ "createdAt": -1 })

    //   // .sample({ size: 3 })

    //   // .limit(20)

    //   .lookup({
    //     from: 'properties',
    //     localField: 'property',
    //     foreignField: '_id',
    //     as: 'property'
    //   })

    //   .lookup({
    //     from: 'bids',
    //     localField: 'bids',
    //     foreignField: '_id',
    //     as: 'bids'
    //   })


    // promotions.exec().then(result => {
    //   // result has your... results
    //   // console.log("Auctioned properties: ", result)

    //   res.json(result)
    // });



  } catch (error) {
    return res.json(error)
  }
}

exports.saveBid = async (req, res) => {
  const { auctionId, propertyId, propertyImage, developerId, price, text } = req.body
  // return res.json({fid, floorNo, coordinates})

  console.log('Promotion Data: ', req.body)

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
    // console.log('Error: ', error.message)
    return res.json({ status: 'error', msg: error.message })
  }

}

exports.confirm_auction_winner = async (req, res) => {
  const { auctionId, buyerId, bidPrice } = req.body
  // return res.json({fid, floorNo, coordinates})

  // console.log('Promotion Data: ', req.body)
  const token = req.headers.authorization

  try {

    const data = jwt.verify(token, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id })

    // console.log('User: ', user)

    // return

    if (user) {


      const auction = await Auction.findById(auctionId)
      const property = await Property.findById(auction.property)

      const existedThread = await Thread.findOne({
        members: { $in: [mongoose.Types.ObjectId(user._id)] },
        $and: [
          {
            // members:{ $in: [mongoose.Types.ObjectId(user._id)]},  
            members: { $in: [mongoose.Types.ObjectId(buyerId)] }
          }
        ]
      })

      // return console.log('Existed Thread: ', existedThread)

      const thread = existedThread ? existedThread : new Thread()

      if (!existedThread) {
        thread.cid = getCid()
        thread.members = [
          mongoose.Types.ObjectId(user._id),
          mongoose.Types.ObjectId(buyerId)
        ]
        await thread.save()
      }

      const text = `Congratulations! you have won a property auction by $${bidPrice} bid.`

      const req = new Request()
      req.cid = getCid()
      req.members = thread.members
      req.admin = buyerId
      req.buyer = user._id
      req.developer = user._id
      req.property = property._id
      req.coverLetter = text
      req.request_type = 'buy'
      req.status = 'accepted'
      await req.save()

      const neg = new Negotiation()
      req.members = thread.members
      neg.admin = buyerId
      neg.developer = property.developer
      neg.manager = property.manager
      neg.buyer = user._id
      neg.property = property._id
      neg.request = req._id
      neg.message = 'Top bid'
      neg.price = bidPrice
      neg.status = 'accepted'
      await neg.save()

      req.negotiation = neg._id
      await req.save()

      property.requests = [...property.requests, req._id]
      await property.save()

      const msg = new Message()
      msg.cid = getCid()
      msg.thread = thread._id
      msg.sender = user._id
      msg.receiver = buyerId
      msg.text = text
      msg.property = property._id
      msg.request = req._id
      // msg.negotiation = neg._id
      msg.type = 'text'
      await msg.save()

      const process = new Process()
      process.cid = getCid()
      process.members = req.members
      process.buyer = buyerId
      process.manager = property.manager
      process.developer = property.developer
      process.thread = thread._id
      process.property = property._id
      process.price = bidPrice
      process.request = req._id
      await process.save()

      const notify = new Notification()
      notify.cid = getCid()
      notify.user = buyerId
      notify.text = text
      notify.link = `/buyer/process/${process._id}?thread=${thread._id}`
      notify.icon = 'check'
      await notify.save()

      auction.isCompleted = true
      await auction.save()

      res.json({ status: 'success', process })

    }
    else {
      res.json({ status: 'error', msg: 'You are not authorised to do this action' })
    }


  } catch (error) {
    // console.log('Error: ', error.message)
    console.log('Error Occured! ', error.message);

    return res.json({ status: 'error', msg: error.message })
  }

}

