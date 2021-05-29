const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
const getUserFromToken = require('../middlewares/auth_token');
const userProfile = require('../models/profile');
const User = require('../models/user');

// router to get loggedin user profile
router.get("/", getUserFromToken, async function(req, res) {
    let userId = req.user;

    if (!userId) {
        return res.status(200).json({'status': false, 'mesage': 'Invalid User Id'});
    }

    try {
        let profile = await userProfile.findOne({user: userId}).populate(['name', 'avatar']);
        if (!profile) {
            return res.status(200).json({'status': false, 'message': 'User profile not found'});
        }

        return res.status(200).json({'status': true, 'profile': profile});
    } catch (err) {
        return res.status(500).send("Server Error");
    }
});


// router to create a new profile
router.post('/new', [
    check('occupation', 'Occupation is compulsory').not().isEmpty(),
    check('educations', 'Education is compulsory').not().isEmpty(),
    getUserFromToken
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({'status': false, 'message': errors.array()});
  }

  const user_id = req.user;

  if (!user_id) {
      return res.status(200).json({'status': false, 'message': 'Invalid User Id'});
  }

  try {
      const user = await User.findOne({id: user_id});
      const {
          occupation,
          location,
          bio,
          skills,
          experiences,
          educations,
          social
      } = req.body;

      const profile = {}
      profile.user = user_id;
      if (occupation) {
        profile.occupation = occupation;
      }

      if (location) {
          profile.location = location;
      }

      if (bio) {
          profile.bio = bio;
      }

      if (skills) {
          profile.skills = skills.split(",").map(skill => skill.trim());
      }

      if (experiences) {
          profile.experiences = [];
          [...experiences].forEach(function (experience) {
              if (experience.title && experience.company && experience.from) {
                  experience.from = new Date(experience.from);
                  if (experience.to) {
                      experience.to = new Date(experience.to);
                  }
                  profile.experiences.push(experience);
              }
          });
      }

      console.log("@@@@@@@@@@@@@@");

      if (educations) {
          profile.educations = [];
          [...educations].forEach(function (education) {
              if (education.institute && education.degree && education.field && education.from) {
                  education.from = new Date(education.from);
                  if (education.to) {
                      education.to = new Date(education.to);
                  }
                  profile.educations.push(education);
              }
          });
      }

      if (social) {
          profile.social = {};
          if (social.facebook) {
              profile.social.facebook = social.facebook;
          }

          if (social.twitter) {
              profile.social.twitter = social.twitter;
          }

          if (social.facebook) {
              profile.social.instagram = social.facebook;
          }

          if (social.whatsapp) {
              profile.social.whatsapp = social.whatsapp;
          }

          if (social.github) {
              profile.social.github = social.github;
          }

          if (social.youtube) {
              profile.social.youtube = social.youtube;
          }

          if (social.linkedIn) {
              profile.social.linkedIn = social.linkedIn;
          }
      }

      let oldProfile = await userProfile.findOne({user: user_id});

      if (oldProfile) {
          oldProfile = await userProfile.findOneAndUpdate(
            {user: user_id},
            {$set: {profile}}, {new: true}
          );

          return res.status(200).json({'status': true, 'profile': profile});
      }


      userNewProfile = new userProfile(profile);
      const saveStatus = await userNewProfile.save();

      if (saveStatus) {
          return res.status(200).json({'status': true, 'profile': profile});
      }

      return res.status(200).json({'status': false, 'message': 'Unable to create new profile'});

  } catch (err) {
      return res.status(500).json({'status': false, 'message': err.message});
  }
});

module.exports = router;
