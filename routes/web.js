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
const PromotionController = require('../app/http/controllers/PromotionController')
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

const LoanApplicationController = require('../app/http/controllers/LoanApplicationController')

const ProcessController = require('../app/http/controllers/ProcessController')
const ZoomController = require('../app/http/controllers/ZoomController')

const SelectedPropertiesController = require('../app/http/controllers/SelectedPropertiesController')

const SearchController = require('../app/http/controllers/SearchController')



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
router.post('/change_project_manager', ProjectController.change_project_manager)
router.post('/save_contract_details', ProjectController.save_contract_details)
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

router.get('/filter_search_example', PropertyController.filterSearch)

router.get('/filter_search', SearchController.filterSearch)


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
router.post('/save_auctions', AuctionController.saveAuction)
router.get('/my_auctions', AuctionController.myAuctions)
router.get('/all_auctions', AuctionController.allAuctions)
router.get('/get_single_auction/:id', AuctionController.getSingleAuction)
router.get('/auctioned_properties', AuctionController.auctionedProperties)
router.post('/save_bid', AuctionController.saveBid)
router.post('/cance_auction', AuctionController.cance_auction)
router.post('/confirm_auction_winner', AuctionController.confirm_auction_winner)


//Promotions
router.post('/save_promotion', PromotionController.savePromotion)
router.get('/my_promotions', PromotionController.myPromotions)
router.post('/cancel_promotion', PromotionController.cancel_promotion)


//Activities
router.get('/my_activities', DashboardController.getMyActivities)


//Messanger
router.post('/get_my_thread_by_id', MessangerController.getMyThreadById)
router.get('/get_my_threads', MessangerController.getMyThreads)
router.get('/get_thread_messages/:id/:msgLimit', MessangerController.getThreadMessages)
router.post('/send_message', MessangerController.sendMessage)

router.post('/make_appointment_request', MessangerController.make_appointment_request)


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
router.post('/re_send_invitation', InvitationController.reSendInvitationLink)
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


router.post('/selected-properties/selected_properties_status', SelectedPropertiesController.saveSelectedPropertiesStatus)
router.post('/selected-properties/save', SelectedPropertiesController.save_selected_properties)
router.get('/selected-properties/get', SelectedPropertiesController.getSelectedProperties)
router.post('/selected-properties/remove', SelectedPropertiesController.remove_selected_property)



// router.post('/slider/save', SliderController.saveSlider)
// router.get('/slider/get', SliderController.getSlider)


router.post('/get_user_loan_application_info', LoanApplicationController.getUserLoanApplication)
router.post('/save_user_loan_application_info', LoanApplicationController.saveUserLoanApplication)

router.post('/save_buyer_profile', ProfileController.save_buyer_profile)
router.post('/get_buyer_profile', ProfileController.get_buyer_profile)


router.post('/get_user_notifications', DashboardController.get_user_notification)
router.post('/set_notification_unseen', DashboardController.set_notification_unseen)

router.post('/bookmark_property', DashboardController.bookmarkProperty)
router.get('/get_buyer_favourite_list/:userId', DashboardController.get_buyer_favourite_list)

router.post('/compare_property', DashboardController.compare_property)
router.get('/get_buyer_compare_list/:userId', DashboardController.get_buyer_compare_list)

router.post('/accept_appointment', RequestController.acceptAppointment)

router.post('/get_appointments', RequestController.getAppointments)

router.get('/get_pending_loan_profiles', LoanApplicationController.get_pending_loan_profiles)
router.get('/get_approved_loan_profiles', LoanApplicationController.get_approved_loan_profiles)
router.get('/get_user_loan_profile/:loanId', LoanApplicationController.get_user_loan_profile)

router.post('/change_loan_status/', LoanApplicationController.change_loan_status)

//Get thread or create new one
router.post('/get_thread_or_create/', MessangerController.get_thread_or_create)


//Get Israpoly users for admin
router.get('/get_israpoly_members/', AdminController.getIsrapolyMembers)
router.get('/get_realestate_developers/', AdminController.getRealestateDevelopers)

//Zoom Meeting
router.post('/create_zoom_meeting', ZoomController.createMeetingLink)



// Purchase Process
router.post('/create_purchase_process', ProcessController.createPurchaseProcess)
router.post('/get_secured_process', ProcessController.get_secured_process)
router.post('/get_my_property_process', ProcessController.get_my_property_process)

// router.post('/save_buyer_consult_lawyer_process', ProcessController.save_buyer_consult_lawyer_process)
// router.post('/save_developer_consult_lawyer_process', ProcessController.save_developer_consult_lawyer_process)

//Procss
router.post('/upload_process_agreement', UploadController.upload_process_agreement)
router.post('/get_process_negotiations', ProcessController.get_process_negotiations)
router.post('/send_contract_to_buyer', ProcessController.send_contract_to_buyer)
router.post('/validate_contract_by_buyer', ProcessController.validate_contract_by_buyer)
router.post('/confirming_sign_by_buyer', ProcessController.confirming_sign_by_buyer)
router.post('/get_otp_on_mobile', ProcessController.get_otp_on_mobile)
router.post('/send_signed_document_by_buyer', ProcessController.send_signed_document_by_buyer)
router.post('/developer_confirm_signature_done', ProcessController.developer_confirm_signature_done)

router.post('/download_signed_contract', ProcessController.download_signed_agreement)



router.post('/get_reservation_agreement', ProcessController.get_reservation_agreement)

router.get('/get_developer_details/:id', AdminController.get_developer_details)

//Agreement OTP
// router.post('/send_secret_code_again', ProcessController.send_secret_code_again)



// router.post('/varify_developer_agreement_mobile_otp', ProcessController.varify_developer_agreement_mobile_otp)

// router.post('/get_user_signature_url', ProcessController.get_user_signature_url)




// router.post('/slider/save/:id', Authorization, SliderController.saveByID)
// router.post('/slider/delete/:id', Authorization, SliderController.deleteByID)

// router.get('/slider/get/:id', SliderController.getByID)
// router.get('/slider/getall', SliderController.getAll)
// router.get('/slider/getactive', SliderController.getActive)
// router.get('/slider/get-random-one', SliderController.getRandomOne)

module.exports = router

