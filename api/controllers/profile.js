const UserProfile = require('../services/profile');
const getUserFromToken = require('../middlewares/auth_token');
const { check, validationResult } = require('express-validator');

exports.validate = (method) => {
    switch (method) {
        case 'createProfile': {
           return [
               check('occupation', 'Occupation is compulsory').not().isEmpty(),
               check('educations', 'Education is compulsory').not().isEmpty(),
               getUserFromToken
           ];
        }

        case 'userIdFromToken': {
            return getUserFromToken
        }
    }
}

exports.getUserProfile = async function (req, res) {
    const userId = req.params.user_id;
    const userProfile = new UserProfile(userId);

    const profile = await userProfile.getUserProfileFromUserId();
    if (profile) {
        return res.status(200).json({'status': true, 'profile': profile});
    }

    res.status(200).json({'status': false, 'message': 'Invalid User Id'});
}

exports.createNewProfile = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({'status': false, 'message': errors.array()});
    }

    const userId = req.user;
    if (!userId) {
        return res.status(200).json({'status': false, 'message': 'Invalid User Id'});
    }

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
    profile.user = userId;
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

    const userProfile = new UserProfile(userId);
    const oldProfile = await userProfile.getUserProfileFromUserId();
    if (oldProfile) {
        const updatedProfile = await userProfile.updateUserProfile(profile);
        return res.status(200).json({'status': true, 'profile': updatedProfile});
    }

    const saveStatus = await UserProfile.addNewUserProfile(profile);
    if (saveStatus) {
        return res.status(200).json({'status': true, 'profile': profile});
    }

    return res.status(200).json({'status': false, 'message': 'Unable to create new profile'});
}


exports.getLoggedInUserProfile = async function(req, res) {
    let userId = req.user;
    if (!userId) {
        return res.status(200).json({'status': false, 'message': 'Invalid User Id'});
    }

    let userProfile = new UserProfile(userId);
    let profile = await userProfile.getUserProfileFromUserId();
    if (!profile) {
        return res.status(200).json({'status': false, 'message': 'User profile not found'});
    }

    return res.status(200).json({'status': true, 'profile': profile});
}


exports.getProfileForInstitute = async function(req, res) {
    const instituteId = req.query.instituteId;

    if (!instituteId) {
        return res.status(200).json({'status': false, 'message': "Invalid Institute Id"});
    }

    let profiles = await UserProfile.getProfilesFromInstituteId(instituteId);
    if (!profiles) {
        return res.status(200).json({'status': false, 'message': 'User profile not found'});
    }

    return res.status(200).json({'status': true, 'profiles': profiles});

}

exports.deleteProfile = async function(req, res) {
    const userId = req.user;

    if (!userId) {
        return res.status(200).json({'status': false, 'message': "User id not found"});
    }

    let profile = new UserProfile(userId);
    let result = await profile.deleteUserProfile();

    if (!result) {
        return res.status(200).json({'status': false, 'message': "Profile not deleted"});
    }

    return res.status(200).json({'status': true, 'message': "profile deleted successfully"});
}

exports.updateProfileExperiences = async function(req, res) {
    const userId = req.user;
    const experiences = req.body.experience;

    if (!userId) {
        return res.status(200).json({'status': false, 'message': 'User Id not found'});
    }

    let profile = new UserProfile(userId);
    let result = await profile.updateProfileExperiences(experiences);

    if (result) {
        return res.status(200).json({'status': true, 'profile': result});
    }
    return res.status(200).json({'status': false, 'message': "Unable to update user profile experience"});
}

exports.updateProfileEducation = async function(req, res) {
    const userId = req.user;
    const education = req.body.education;

    if (!userId) {
        return res.status(200).json({'status': false, 'message': 'User Id not found'});
    }

    let profile = new UserProfile(userId);
    let result = await profile.updateProfileEducation(education);

    if (result) {
        return res.status(200).json({'status': true, 'profile': result});
    }

    return res.status(200).json({'status': false, 'message': "Unable to update user profile education"});
}