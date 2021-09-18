const jwt = require('jsonwebtoken')
const User = require('../../app/models/User');

const Authorization = async (req, res, next) => {

    const token = req.headers.authorization

    if(!token) return  res.status(401).json({type: 'error', msg:'You are not allowed to do this action'})

    try {
        
        const data = jwt.verify(token, process.env.APP_SECRET);
        
        const user = await User.findOne({_id: data.id})
 
        if(user) {
            next()
        } else{
            return res.status(401).json({type: 'error', msg:'You are not allowed to do this action'})
        }

    } catch (error) {
        res.json({type: 'error', msg:'You are not allowed to do this action'})
    }
}

module.exports = Authorization