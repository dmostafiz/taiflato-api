const Activity = require("../../models/Activity")
const jwt = require('jsonwebtoken')
const User = require("../../models/User")
const Notification = require("../../models/Notification")
const Property = require("../../models/Property")
const BookMark = require("../../models/BookMark")
const Compare = require("../../models/Compare")

exports.getMyActivities = async (req, res) => {
     const token = req.headers.authorization

     console.log('My Token: ', token)

     if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

     try {
          const data = jwt.verify(token, process.env.APP_SECRET)

          const user = await User.findOne({ _id: data.id })

          if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


          const activities = await Activity.find({ user: user._id }).limit(8).sort({ 'createdAt': -1 })

          // console.log('Activities: ', activities.length)
          return res.json(activities)




     } catch (error) {
          // console.log('Error: ', error)
          return res.json({ status: 'error', msg: 'Your are not authorised' })
     }

}


exports.get_my_managers = async (req, res) => {
     const token = req.headers.authorization

     // console.log('My Token: ', token)

     if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

     try {
          const data = jwt.verify(token, process.env.APP_SECRET)

          const user = await User.findOne({ _id: data.id })

          if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


          const managers = await User.find({ realestate_admin: user._id, account_verified: true })

          // console.log('Managers: ', managers)
          return res.json({ managers: managers })



     } catch (error) {
          // console.log('Error: ', error)
          return res.json({ status: 'error', msg: 'Your are not authorised' })
     }

}

exports.get_user_notification = async (req, res) => {
     const token = req.headers.authorization

     // console.log('My Token: ', token)

     if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

     try {
          const data = jwt.verify(token, process.env.APP_SECRET)

          const user = await User.findOne({ _id: data.id })

          if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


          const notifications = await Notification.find({ user: user._id, status: 'unseen' }).limit(8).sort({ 'createdAt': -1 })

          // console.log('Activities: ', notifications.length)
          return res.json({status: 'success', notifications})


     } catch (error) {
          // console.log('Error: ', error)
          return res.json({ status: 'error', msg: 'Your are not authorised' })
     }

}

exports.set_notification_unseen = async (req, res) => {
     const token = req.headers.authorization
     const {notificationId} = req.body
     // console.log('My Token: ', token)

     if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

     try {
          const data = jwt.verify(token, process.env.APP_SECRET)

          const user = await User.findOne({ _id: data.id })

          if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })


          const not = await Notification.findOne({ user: user._id, _id: notificationId })
          not.status = 'seen'
          await not.save()

          const notifications = await Notification.find({ user: user._id, status: 'unseen' }).limit(8).sort({ 'createdAt': -1 })

          // console.log('Notification: ', not)
          return res.json({status: 'success', notifications: notifications})


     } catch (error) {
          // console.log('Error: ', error)
          return res.json({ status: 'error', msg: 'Your are not authorised' })
     }

}

exports.bookmarkProperty = async (req, res) => {
     const token = req.headers.authorization

     const {propertyId} = req.body
     // console.log('My Token: ', token)

     if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

     try {
          const data = jwt.verify(token, process.env.APP_SECRET)

          const user = await User.findOne({ _id: data.id })

          if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

          const property = await Property.findById(propertyId)

          if(property) {

               let bookmark = await BookMark.findOne({
                    property: propertyId,
                    user: user._id
               })

               if(bookmark){

                    await bookmark.delete()

               }else{

                    bookmark = new BookMark()
                    bookmark.property = property._id
                    bookmark.user = user._id
                    await bookmark.save()
               }


               return res.json({status: 'success', bookmark})
          }


     } catch (error) {
          console.log('Error: ', error)
          return res.json({ status: 'error', msg: 'Your are not authorised' })
     }

}

exports.compare_property = async (req, res) => {
     const token = req.headers.authorization

     const {propertyId} = req.body
     // console.log('My Token: ', token)

     if (!token) return res.json({ status: 'error', msg: 'Your are not authorised' })

     try {
          const data = jwt.verify(token, process.env.APP_SECRET)

          const user = await User.findOne({ _id: data.id })

          if (!user) return res.json({ status: 'error', msg: 'Your are not authorised' })

          const property = await Property.findById(propertyId)

          if(property) {

               let compare = await Compare.findOne({
                    property: propertyId,
                    user: user._id
               })

               if(compare){

                    await compare.delete()

               }else{

                    compare = new Compare()
                    compare.property = property._id
                    compare.user = user._id
                    await compare.save()
               }


               return res.json({status: 'success', compare})
          }


     } catch (error) {
          console.log('Error: ', error)
          return res.json({ status: 'error', msg: 'Your are not authorised' })
     }

}

exports.get_buyer_favourite_list = async (req, res) => {
     const userId = req.params.userId 

     console.log('User ID: ', req.params)

     try {

          const bookmarks = await BookMark.find().populate([
               {
                    path: 'property',
                    model: 'Property',
                    populate:[
                         {
                              path: 'image',
                              model: 'File'
                         },
                         {
                              path: 'project',
                              model: 'Project',
                     
                         }
                    ]
               }
               
          ])

          // console.log('BookMarks: ', bookmarks)

          return res.json({ status: 'success', bookmarks})   
          
          
     } catch (error) {
          // console.log('Error: ', error)
          return res.json({ status: 'error', msg: error.message})   
     }
}

exports.get_buyer_compare_list = async (req, res) => {
     const userId = req.params.userId 

     // console.log('User ID: ', req.params)

     try {

          const bookmarks = await Compare.find().populate([
               {
                    path: 'property',
                    model: 'Property',
                    populate:[
                         {
                              path: 'image',
                              model: 'File'
                         },
                         {
                              path: 'project',
                              model: 'Project',
                     
                         }
                    ]
               }
               
          ])

          // console.log('Compares: ', bookmarks)

          return res.json({ status: 'success', bookmarks})   
          
          
     } catch (error) {
          // console.log('Error: ', error)
          return res.json({ status: 'error', msg: error.message})   
     }
}


