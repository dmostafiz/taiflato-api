const mongoose = require('mongoose')

const InviteSchema = mongoose.Schema({

    cid:{
        type: Number
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },

    email: {
        type: String
    },
  
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'  
    },
  

    inviteType: {
      type: String
    },

    secure_token: {
      type: String
    },
  
    status: {
        type: String,
        enum:['pending','complete'],
        default:'pending'
    },

})

InviteSchema.set('timestamps', true)

module.exports = mongoose.model('Invite', InviteSchema)