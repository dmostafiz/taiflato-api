const mongoose = require("mongoose")
const User = require("../../models/User")

exports.getUserById = async (req, res) => {

    const id = req.params.id
  
    console.log('User ID: ', id)
  
    try {
  
      const user = User.aggregate()
  
        .match({ _id: mongoose.Types.ObjectId(id) })
  
        // .lookup({
        //   from: 'files',
        //   localField: 'image',
        //   foreignField: '_id',
        //   as: 'image'
        // })
  
  
      // .lookup({
      //   fr
      // })
      user.exec().then(result => {
        console.log("User: ", result.length ? result[0] : {})
  
        return res.json(result.length ? result[0] : null)
      })
  
    } catch (error) {
      console.log('User Error: ', error.message)  
      return res.json({ status: 'error', msg: error.message })
    }
  
    // return res.json({})
  }

