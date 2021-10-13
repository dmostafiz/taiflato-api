const jwt = require('jsonwebtoken')
const Thread = require('../../models/Thread')
const User = require("../../models/User")

exports.getMyThreads = async (req, res) => {
   const token = req.headers.authorization

   if(!token) return res.json({status:'error', msg: 'Your are not authorised'})

   try {
        const data = jwt.verify(token, process.env.APP_SECRET)
        
        const user = await User.findOne({ _id: data.id }) 

        if(!user) return res.json({status:'error', msg: 'Your are not authorised'})
        
        
        const threads = Thread.aggregate()

                    .match({
                        $or: [
                            { sender: user._id },
                            { receiver: user._id }
                        ]
                    })

                    .lookup({
                        from: 'users',
                        localField: 'sender',
                        foreignField: '_id',
                        as: 'sender'
                    }) 

                    .lookup({
                        from: 'users',
                        localField: 'receiver',
                        foreignField: '_id',
                        as: 'receiver'
                    }) 

        threads.exec().then(result => {

           console.log('Threads: ', result)
           return res.json(result)

        })  


   } catch (error) {
        console.log('Error: ', error)
        return res.json({status:'error', msg: 'Your are not authorised'})
   }

   res.json('ok')
}