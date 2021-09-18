const User = require('../../models/User');
const Category  = require('../../models/Category');
const jwt = require('jsonwebtoken');
const Post = require('../../models/Post');

exports.store = async (req, res) => {

    const {name, slug, description} = req.body

    const token = req.headers.authorization
    console.log('Server Token:', token)

    try {
        
        const data = jwt.verify(token, process.env.APP_SECRET);

        const user = await User.findOne({_id: data.id})
 
        if(user) {

            const cat = new Category()
            cat.name = name
            cat.slug = slug
            cat.description = description
            
            await cat.save()

            return res.status(200).json({type: 'success', msg:'Category created successfully.'})
        }
        
        return res.status(401).json({type: 'error', msg:'You are not allowed to do this action'})

    } catch (error) {
        res.json({type: 'error', msg:error.message})
    }

}

exports.delete = async (req, res) => {

   try {

    await Category.findByIdAndDelete(req.params.cid)

    return res.status(200).json({type: 'success', msg:'Category deleted successfully.'})

   }catch(error) {
    res.json({type: 'error', msg:error.message})
   }

}


exports.get = async (req, res)  => {
    try {
        const categories = await Category.find().sort({ createdAt: -1})
        // console.log('All Category: ',categories)
        res.status(200).json(categories)
    } catch (error) {
        res.status(200).json({type:"error", msg: error.message})
    }
}

exports.postCatsget = async (req, res) => {

    try {
 
        const cats = await Category.find().sort({_id: +1})
        
        const categoriesWithPosts = []

        const mapCats = async (cat, index) => {
            const posts = await Post.find({categories: cat._id})
            if(posts.length > 0){
                categoriesWithPosts.push(cat)
            }
        }

        await Promise.all(cats.map(mapCats))

        return res.status(200).json(categoriesWithPosts)
 
    }catch(error) {
     res.json({type: 'error', msg:error.message})
    }
}