const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name:{
        type: String,
        trim: true,
        require:true,
        unique:true
    },
    slug:{
        type: String,
        trim: true,
        require:true,
        unique:true   
    },
    description:{
        type: String
    },
    status:{
        type: Boolean,
        default: true
    },
    allowed:{
      type: String,
      enum:['all', 'private'],
      default:'all'
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'posts'
        }
    ]

})

categorySchema.set('timestamps', true)

module.exports = mongoose.model('Category', categorySchema)