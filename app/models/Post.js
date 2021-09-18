const mongoose = require('mongoose')
var random = require('mongoose-random');

const postSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    slug:{
        type: String
    },
    body:{
        type: String,
    },
    imageUrl:{
        type: String,
    },
    categories:[
        {          
            type: mongoose.Schema.Types.ObjectId,
            ref:'categories'
        }
    ],
    tags:[
        {
            type:String
        }
    ],
    metaTitle:{
        type: String
    },
    metaDescription:{
        type: String
    },
    fKeywords:[
        {
            type: String
        }
    ],
    status:{
        type: String,
        enum:['publish', 'draft', 'trash'],
        default:'publish'
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

postSchema.set('timestamps', true)

postSchema.plugin(random)

module.exports = mongoose.model('Post', postSchema)