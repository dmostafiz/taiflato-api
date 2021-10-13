const Property = require("../../models/Property");

exports.getMyProcess = async (req, res) => {
    try {

        const properties = Property.aggregate()

           .limit(4)
    
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
          console.log("Properties in buying process: ", result)
    
          return res.json(result)
        });
    
      } catch (error) {
    
        return res.json(error.message)
    
      }
}