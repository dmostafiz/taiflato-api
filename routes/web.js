const express = require('express')
const router = express.Router()

const Authorization = require('./middlewires/Authorization')

const AuthController = require('../app/http/controllers/AuthController')
const PropertyController = require('../app/http/controllers/PropertyController')
const UploadController = require('../app/http/controllers/UploadController')


// const CategoryController = require('../app/http/controllers/CategoryController')
// const PostController = require('../app/http/controllers/PostController')
// const SliderController = require('../app/http/controllers/SliderController')

const BuildingController = require('../app/http/controllers/BuildingController')

const MessangerController = require('../app/http/controllers/MessangerController')
const QueueAbleController = require('../app/http/controllers/QueueAbleController')

const HomeController = require('../app/http/controllers/HomeController')
const UserController = require('../app/http/controllers/UserController')
const BuyingProcessController = require('../app/http/controllers/BuyingProcessController')
const BuyerController = require('../app/http/controllers/BuyerController')
const AuctionController = require('../app/http/controllers/AuctionController')
const RequestController = require('../app/http/controllers/RequestController')
const DashboardController = require('../app/http/controllers/DashboardController')
const TestController = require('../app/http/controllers/TestController')
const InvitationController = require('../app/http/controllers/InvitationController')
const CompanyController = require('../app/http/controllers/CompanyController')
const ProfileController = require('../app/http/controllers/ProfileController')
const ProjectController = require('../app/http/controllers/ProjectController')
const NegotiationController = require('../app/http/controllers/NegotiationController')
const AdminController = require('../app/http/controllers/AdminController')

const SystemController = require('../app/http/controllers/SystemController')

const SliderController = require('../app/http/controllers/SliderController')

const LocationController = require('../app/http/controllers/LocationController')

// const upload = require('../helpers/cloudinary')

router.get('/send_mail', TestController.sendMail)

// Admin controller
router.get('/all_projects/', AdminController.getAllProjects)
router.get('/project_details_for_admin/:id', AdminController.projectDetails)



//Auth
router.post('/login', AuthController.login)

router.post('/register_account', AuthController.register_account)
router.post('/register_account_manager', AuthController.register_account_manager)


router.post('/authorize', AuthController.authorize)
router.post('/secure_user', AuthController.secure_user)
router.post('/switch_dashboard', AuthController.switch_dashboard)
router.post('/get_social_user_login', AuthController.get_social_user_login)

router.post('/get_user_for_email_verification', AuthController.get_user_for_email_verification)
router.post('/get_user_for_update_info', AuthController.get_user_for_update_info)

router.post('/verify_user_email', AuthController.verify_user_email)

router.post('/verify_user_email', AuthController.verify_user_email)


router.post('/get_user_for_phone_verification', AuthController.get_user_for_phone_verification)
router.post('/submit_phone_for_verify', AuthController.submit_phone_for_verify)
router.post('/submit_phone_verify_code', AuthController.submit_phone_verify_code)




router.get('/get_user_by_id/:id', UserController.getUserById)

router.post('/upload_profile_image', UploadController.uploadProfileImage)
// router.post('/upload_profile_image', QueueAbleController.uploadProfileImage)


//Project

router.post('/upload_project_image', UploadController.upload_project_image)
router.post('/create_drafted_project', ProjectController.create_drafted_project)
router.post('/get_my_managers', ProjectController.get_my_managers)
router.post('/save_drafted_project', ProjectController.save_drafted_project)
// router.post('/generate_properties', ProjectController.generate_properties)
router.get('/get_projects/', ProjectController.get_projects)
router.get('/get_project_by_id/:id', ProjectController.get_project_by_id)
router.get('/get_properties_by_project/:id', ProjectController.get_properties_by_project)


// router.get('/get_properties_by_projectid/:projectId', ProjectController.get_properties_by_projectid)


router.post('/update_property', ProjectController.update_property)
router.post('/save_project_properties', ProjectController.save_project_properties)
router.post('/save_project_details', ProjectController.save_project_details)


//Compnay
router.post('/get_company_by_user', CompanyController.getCompanyByUserId)
router.post('/upload_company_logo', UploadController.uploadCompanyLogo)
router.post('/update_user_company_data', CompanyController.update_user_company_data)


//Profile
router.post('/update_user_profile_data', ProfileController.update_user_profile_data)


// const multer = require('multer');
// const upload = multer();

//Property
router.post('/save_property', PropertyController.saveProperty)
router.post('/upload_property_image', UploadController.uploadPropertyImage)
router.post('/action_property', PropertyController.actionProperty)

router.get('/my_properties', PropertyController.getMyProperty)
router.get('/get_single_property/:id', PropertyController.getSingleProperty)
router.get('/pending_properties', PropertyController.getPendingProperty)
router.get('/all_properties', PropertyController.getAllProperty)
router.get('/filter_search', PropertyController.filterSearch)

//Building
router.post('/save_building', BuildingController.saveBuildingPlan)
router.post('/upload_building_image', UploadController.uploadBuildingImage)
router.get('/my_building_plans', BuildingController.getMyBuildingsPlans)
router.get('/all_building_plans', BuildingController.getAllBuildingPlans)
router.get('/get_building_by_id/:id', BuildingController.getBuildingPlansById)

router.get('/pending_building_plans', BuildingController.getPendingBuildingPlans)

//Floor
router.get('/get_floor_by_id/:id', BuildingController.getFloorById)
router.post('/save_floor', BuildingController.saveFloor)
router.post('/upload_floor_image', UploadController.uploadFloorImage)

router.post('/save_apartment', BuildingController.saveApartment)


//Auctions
router.post('/save_promotion', AuctionController.saveAuction)
router.get('/my_auctions', AuctionController.myAuctions)
router.get('/all_promotions', AuctionController.allAuctions)



router.get('/get_single_promotion/:id', AuctionController.getSingleAuction)

router.get('/auctioned_properties', AuctionController.auctionedProperties)

router.post('/save_bid', AuctionController.saveBid)


//Activities
router.get('/my_activities', DashboardController.getMyActivities)


//Messanger
router.post('/get_my_thread_by_id', MessangerController.getMyThreadById)
router.get('/get_my_threads', MessangerController.getMyThreads)
router.get('/get_thread_messages/:id', MessangerController.getThreadMessages)
router.post('/send_message', MessangerController.sendMessage)


//Buyers
router.get('/buyer_selected_properties', BuyerController.getMySelectedProperties)
router.get('/my_process_properties', BuyingProcessController.getMyProcess)

router.post('/send_buying_request', RequestController.sendBuyingRequest)
router.post('/send_offer_request', RequestController.sendOfferRequest)
router.post('/send_meeting_request', RequestController.sendMeetingRequest)


//Requests
router.post('/response_request', RequestController.response_request)

//Negotiation
router.post('/make_negotiation', NegotiationController.make_negotiation)



//Invitation of account manager
router.post('/send_invitation', InvitationController.sendInvitation)
router.get('/get_my_invitation', InvitationController.getMyInvitation)
router.post('/get_invited_user', InvitationController.getInvite)

router.get('/get_managers_by_company_admin/:adminId', CompanyController.get_managers_by_company_admin)



//Home
router.get('/get_featured_properties', HomeController.getFeaturedProperties)
router.get('/get_featured_projects', HomeController.getFeaturedProjects)
router.get('/get_hero_slider', HomeController.getHeroSlider)
router.get('/get_best_deal_properties', HomeController.getBestDealProperties)

router.get('/get_single_property_home/:id', HomeController.getSinglePropertyForHome)


//Companies
router.get('/get_companies',HomeController.getCompanies)
router.get('/get_single_company/:companyId',HomeController.get_single_company)
router.get('/get_projects_by_company/:companyId',HomeController.get_projects_by_company)
router.get('/get_single_project/:id', HomeController.get_single_project)


//Location
router.get('/get_districts',LocationController.getDistricts)
router.get('/get_cities',LocationController.getCities)

router.post('/save_district',LocationController.saveDistrict)
router.post('/save_city',LocationController.saveCity)


//Categories
// router.post('/category/save', Authorization, CategoryController.store)
// router.get('/category/delete/:cid', Authorization, CategoryController.delete)
// router.get('/category/get', CategoryController.get)
// router.get('/posts-cat/get', CategoryController.postCatsget)

// Posts
// router.post('/post/save', Authorization, PostController.save)
// router.post('/post/save/:id', Authorization, PostController.saveByID)
// router.get('/post/get/', PostController.get)
// router.get('/post/get/:slug', PostController.getSingle)
// router.get('/posts/get/:filter?/:limit?', PostController.get)
// router.get('/post/getid/:id', PostController.getById)
// router.get('/post/get/top/:limit', PostController.getTopByLimit)
// router.get('/post/get/random/:limit', PostController.getTopByLimit)
// router.get('/category/:slug/posts', PostController.getPostsByCategory)
router.get('/get_system_option/', SystemController.getSystemOptions)

// //Sliders
router.post('/slider/get_properties', SliderController.get_properties)
router.post('/slider/get_projects', SliderController.get_projects)

router.post('/slider/slider_status', SliderController.saveSliderStatus)
router.post('/slider/save', SliderController.saveSlider)
router.get('/slider/get', SliderController.getSlider)

// router.post('/slider/save/:id', Authorization, SliderController.saveByID)
// router.post('/slider/delete/:id', Authorization, SliderController.deleteByID)

// router.get('/slider/get/:id', SliderController.getByID)
// router.get('/slider/getall', SliderController.getAll)
// router.get('/slider/getactive', SliderController.getActive)
// router.get('/slider/get-random-one', SliderController.getRandomOne)

module.exports = router

