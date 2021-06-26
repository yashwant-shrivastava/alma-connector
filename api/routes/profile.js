const express = require('express');
const router = express.Router();
const profileController = require("../controllers/profile");

// router to get loggedin user profile
router.get("/", profileController.validate('userIdFromToken') , profileController.getLoggedInUserProfile);

// router to create a new profile
router.post('/new', profileController.validate('createProfile'), profileController.createNewProfile);

// get profile for a user
router.get('/user/:user_id', profileController.getUserProfile);

//get profile for institute
router.get('/institute', profileController.getProfileForInstitute);

router.post('/delete', profileController.validate('userIdFromToken'), profileController.deleteProfile);

router.post('/updateExperience', profileController.validate('userIdFromToken'), profileController.updateProfileExperiences);

router.post('/updateEducation', profileController.validate('userIdFromToken'), profileController.updateProfileEducation);

module.exports = router;
