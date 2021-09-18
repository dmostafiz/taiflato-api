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

    password:{
        type: String,
        require: true
    },
    avatar:{
        type: String
    },

    email_verify_token:{
        type: String
    },

    phone_veryfy_code:{
        type: String
    },
})

userSchema.set('timestamps', true)

module.exports = mongoose.model('User', userSchema)