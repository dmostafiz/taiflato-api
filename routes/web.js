const express = require('express')
const router = express.Router()

const Authorization = require('./middlewires/Authorization')

const AuthController = require('../app/http/controllers/AuthController')
const PropertyController = require('../app/http/controllers/PropertyController')
const UploadController = require('../app/http/controllers/UploadController')


const CategoryController = require('../app/http/controllers/CategoryController')
const PostController = require('../app/http/controllers/PostController')
const SliderController = require('../app/http/controllers/SliderController')

// const upload = require('../helpers/cloudinary')


//Auth
router.post('/login', AuthController.login)
router.post('/register_account', AuthController.register_account)
router.post('/authorize', AuthController.authorize)
router.post('/secure_user', AuthController.secure_user)
router.post('/switch_dashboard', AuthController.switch_dashboard)


// const multer = require('multer');
// const upload = multer();

//Property
router.post('/upload_property_image', UploadController.uploadPropertyImage)
router.post('/save_property', PropertyController.saveProperty)
router.post('/action_property', PropertyController.actionProperty)

router.get('/my_properties', PropertyController.getMyProperty)
router.get('/get_single_property/:id', PropertyController.getSingleProperty)

router.get('/pending_properties', PropertyController.getPendingProperty)

router.get('/all_properties', PropertyController.getAllProperty)

router.get('/filter_search', PropertyController.filterSearch)


//Categories
router.post('/category/save', Authorization, CategoryController.store)
router.get('/category/delete/:cid', Authorization, CategoryController.delete)
router.get('/category/get', CategoryController.get)
router.get('/posts-cat/get', CategoryController.postCatsget)

// Posts
router.post('/post/save', Authorization, PostController.save)
router.post('/post/save/:id', Authorization, PostController.saveByID)
router.get('/post/get/', PostController.get)
router.get('/post/get/:slug', PostController.getSingle)
router.get('/posts/get/:filter?/:limit?', PostController.get)
router.get('/post/getid/:id', PostController.getById)
router.get('/post/get/top/:limit', PostController.getTopByLimit)
router.get('/post/get/random/:limit', PostController.getTopByLimit)
router.get('/category/:slug/posts', PostController.getPostsByCategory)

//Sliders
router.post('/slider/save', Authorization, SliderController.save)
router.post('/slider/save/:id', Authorization, SliderController.saveByID)
router.post('/slider/delete/:id', Authorization, SliderController.deleteByID)

router.get('/slider/get/:id', SliderController.getByID)
router.get('/slider/getall', SliderController.getAll)
router.get('/slider/getactive', SliderController.getActive)
router.get('/slider/get-random-one', SliderController.getRandomOne)

module.exports = router

