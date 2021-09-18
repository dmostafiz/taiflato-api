const Post = require("../../models/Post")
const jwt = require('jsonwebtoken')
const { destroy, upload } = require("../../../helpers/cloudinary")
const Category = require("../../models/Category")


exports.save = async (req, res) => {
    const {title, slug, body, image, categories, tags, metaTitle, metaDescription, fKeywords, status} = req.body

    const saveCategories = []

    categories.map(cat => {
        saveCategories.push(cat.value)
    })

    try {

        const token = req.headers.authorization
        const data = jwt.verify(token, process.env.APP_SECRET);

        let imageUrl = ''

        if(image != '')
        {
           const uploadImage = await upload(image,'posts')
    
           console.log('new upload: ', uploadImage)
    
           imageUrl = uploadImage.secure_url
        }

        const post = new Post()  
            post.title = title
            post.slug = slug
            post.body = body
            post.imageUrl = imageUrl
            post.categories = saveCategories
            post.tags = tags
            post.metaTitle = metaTitle
            post.metaDescription = metaDescription
            post.fKeywords = fKeywords
            post.status = status
            post.author = data.id
            await post.save()

        return res.status(200).json({type: 'success',id: post._id, msg:'Post saved successfully.'})
        
    } catch (error) {
        res.json({type: 'error', msg:error.message})
    }

}

exports.saveByID = async (req, res) => {

    // console.log(imageUrl)

    // return res.status(200).json({type: 'success', msg:'Post saved successfully.'})

    console.log(req.body)
    try {

        const {title, slug, body, rawImage, image, categories, tags, metaTitle, metaDescription, fKeywords, status} = req.body

        const saveCategories = []
    
        categories.map(cat => {
            saveCategories.push(cat.value)
        })
    
    
        let img_url
    
        if(rawImage != '') 
        {
           console.log('Should destroy...')
    
           await destroy(image, 'posts')
    
           const uploadImage = await upload(rawImage, 'posts')
    
           console.log('new upload: ', uploadImage)
    
           img_url = uploadImage.secure_url
        }
        else{
           img_url = image
        }
    
        console.log('Image - URL: ',img_url)



        const token = req.headers.authorization
        const data = jwt.verify(token, process.env.APP_SECRET);

        await Post.findByIdAndUpdate(req.params.id, {
            title: title,
            slug: slug,
            body: body,
            imageUrl: img_url,
            categories: saveCategories,
            tags: tags,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            fKeywords: fKeywords,
            status: status,
            // author: data.id
        })  

        return res.status(200).json({type: 'success', msg:'Post saved successfully.'})
        
    } catch (error) {
        res.json({type: 'error', msg:error.message})
    }
}



exports.get = async (req, res) => {

    
    
    try {
        const filter = req.params.filter
        // const page = (req.params.page ? req.params.page : 1) - 1
        // const limit = 4
        const skip = 0
        const limit = parseInt(req.params.limit)

        let cat
        if(filter !== undefined || filter !== null) 
        {
          cat = await Category.findOne({slug: filter})
        }
        const findMe = cat ? {categories: cat?._id} : {}
        
        console.log('Server cat: ', cat)

        const posts = await Post.find(findMe)
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1})
        .populate(
                [
                    {
                        path:'author',
                        // model:'User',
                        populate:{
                            path: 'profile',
                            model:'Profile'
                        }
                    },
                    {
                        path:'categories',
                        model:'Category'
                    }
                ]
            )

        const postCount = (await Post.find(findMe)).length

        res.status(200).json({posts, count:postCount})
    } catch (error) {
        res.status(200).json({type:"error", msg: error.message})
    }
}

exports.getSingle = async (req, res) => {
    try {
        const post = await Post.findOne({slug: req.params.slug}).populate([
            {
                path:'author',
                model:'User',
                populate:{
                    path:'profile',
                    model:'Profile'
                }
            },

            {
                path:'categories',
                model:'Category'
            }
        ])

        // console.log('Single post: ',post)

        res.status(200).json(post)
    } catch (error) {
        res.status(200).json({type:"error", msg: error.message})
    }
}

exports.getById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate([
            {
                path:'author',
                model:'User',
                populate:{
                    path:'profile',
                    model:'Profile'
                }
            },

            {
                path:'categories',
                model:'Category'
            }
        ])

        console.log('Single post: ',post)

        res.status(200).json(post)
    } catch (error) {
        res.status(200).json({type:"error", msg: error.message})
    }
}

exports.getTopByLimit = async (req, res) => {

    
    
    try {
        const limit = parseInt(req.params.limit)
        // console.log(`Limit = ${req.params.limit}`)

        const postCount = await Post.count()

        
        var rand = Math.floor(Math.random() * postCount)

        if((rand + limit) > postCount) rand = rand - limit
        // console.log('random', rand)

        const posts = await Post.find()
        .skip(rand)
        .limit(limit)
        .populate([
            {
                path:'author',
                model:'User',
                populate:{
                    path:'profile',
                    model:'Profile'
                }
            },

            {
                path:'categories',
                model:'Category'
            }
        ])

        // console.log('Single post: ',post)

        res.status(200).json(posts)
    } catch (error) {
        res.status(200).json({type:"error", msg: error.message})
    }
} 

exports.getTopByRandom = async (req, res) => {

    
    
    try {
        const limit = parseInt(req.params.limit)
        // console.log(`Limit = ${req.params.limit}`)

        const postCount = await Post.count()

        
        var rand = Math.floor(Math.random() * postCount)

        if((rand + limit) > postCount) rand = rand - limit
        // console.log('random', rand)

        const posts = await Post.find()
        .skip(rand)
        .limit(limit)
        .populate([
            {
                path:'author',
                model:'User',
                populate:{
                    path:'profile',
                    model:'Profile'
                }
            },

            {
                path:'categories',
                model:'Category'
            }
        ])

        // console.log('Single post: ',post)

        res.status(200).json(posts)
    } catch (error) {
        res.status(200).json({type:"error", msg: error.message})
    }
} 

exports.getPostsByCategory = async (req, res) => {
    console.log('Category Slug: ', req.params.slug)
    try {
    
        const cat = await Category.findOne({slug: req.params.slug})

        const posts = cat ? await Post.find({categories: cat._id}) 
                                        .select('title metaDescription createdAt')
                                        .populate({
                                            path:'author',
                                            model:'User',
                                            populate:{
                                                path:'profile',
                                                model:'Profile',
                                                select: 'first_name last_name avatar'
                                            },
                                            select:'username'
                                        }) : []

        res.status(200).json(posts)

    } catch (error) {
        res.json({type: 'error', msg:error.message})
    }
}