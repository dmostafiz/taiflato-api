const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    
    uid:{
        type: String,
        unique:true
    },

    username:{
        type: String,
        require:true,
        unique:true
    },

    email:{
        type: String,
        require:true,
        unique:true   
    },

    country:{
        type: String,
        require:true  
    },

    phone:{
        type: String,
        require:true  
    },

    first_name:{
        type: String,
        require:true  
    },

    last_name:{
        type: String,
        require:true  
    },

    user_type:{
        type: String,
        require:true  
    },

    dashboard:{
        type: String,
        require:true  
    },

    profile:{},

    password:{
        type: String,
        require: true
    },
    avatar:{
        type: String
    },
    account_verified:{
        type: Boolean,
        default: false
    },

    secure_url_token:{
        type: String
    },

    email_verified:{
        type: Boolean,
        default: false
    },
    email_verify_code:{
        type: String
    },

    phone_verified:{
        type: Boolean,
        default: false
    },
    phone_veryfy_code:{
        type: String
    },
})

userSchema.set('timestamps', true)

module.exports = mongoose.model('User', userSchema)