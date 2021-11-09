const mongoose = require("mongoose")
const User = require("../../models/User")

exports.getUserById = async (req, res) => {

  const id = req.params.id

  console.log('User ID: ', id)

  try {

    const user = await User.findById(id)
      .populate([
        {
          path: 'profile',
          Model: 'Profile'
        },
        {
          path: 'company',
          Model: 'Company'
        }
      ])

      return res.json(user)
    // .lookup({
    //   from: 'files',
    //   localField: 'image',
    //   foreignField: '_id',
    //   as: 'image'
    // })


    // .lookup({
    //   fr
    // })
    // user.exec().then(result => {
    //   console.log("User: ", result.length ? result[0] : {})

    //   return res.json(result.length ? result[0] : null)
    // })

  } catch (error) {
    console.log('User Error: ', error.message)
    return res.json({ status: 'error', msg: error.message })
  }

  // return res.json({})
}

