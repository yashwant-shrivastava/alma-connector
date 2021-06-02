const Profile = require('../models/profile');
const Logger = require('../utils/logger');

class UserProfile {
    constructor(userId) {
        this.userId = userId;
        this.logger = new Logger(__filename);
    }

    async getUserProfileFromUserId() {
        try {
            const profile = await Profile.findOne({user: this.userId}).populate('user', ['name', 'avatar']);
            return profile;
        } catch (err) {
            logger.error(`Unable to get profile for user id: ${this.userId}`)
            return null;
        }
    }

    async updateUserProfile(profile) {
        try {
            const newProfile = await Profile.findOneAndUpdate(
                  {user: this.userId},
                  {$set: profile}, {new: true}
            );

            return newProfile;
        } catch (err) {
            logger.error(`Unable to update profile for user id: ${this.userId}, "profile: ${profile}`);
            return null;
        }
    }

    static async addNewUserProfile(profile) {
        try {
            const newProfile = new Profile(profile);
            return await newProfile.save();
        } catch (err) {
            const logger = new Logger(__filename);
            logger.error(`Unable to add profile for user id: ${this.userId}`);
            return null;
        }
    }

    static async getProfilesFromInstituteId(instituteId) {
        try {
            const userProfiles = await Profile.find({'educations.institute': instituteId});
            return userProfiles;
        } catch (err) {
            const logger = new Logger(__filename);
            logger.error`Unable to get profile for insitute id: ${instituteId}, err: ${err}`;
            return null;
        }
    }
}


module.exports = UserProfile;
