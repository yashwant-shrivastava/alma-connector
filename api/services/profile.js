const ProfileModal = require('../models/profile');
const Logger = require('../utils/logger');

class UserProfile {
    constructor(userId) {
        this.userId = userId;
        this.logger = new Logger(__filename);
    }

    async getUserProfileFromUserId() {
        try {
            return await ProfileModal.findOne({user: this.userId}).populate('user', ['name', 'avatar']);
        } catch (err) {
            this.logger.error(`Unable to get profile for user id: ${this.userId}`)
            return null;
        }
    }

    async updateUserProfile(profile) {
        try {
            return await ProfileModal.findOneAndUpdate(
                {user: this.userId},
                {$set: profile}, {new: true}
            );
        } catch (err) {
            this.logger.error(`Unable to update profile for user id: ${this.userId}, "profile: ${profile}`);
            return null;
        }
    }

    async updateProfileEducation(educations) {
        try {
            return await ProfileModal.findOneAndUpdate(
                {user: this.userId},
                {$set: {educations: educations}}, {new: true}
            );
        } catch (err) {
            this.logger.error(`Unable to update profile experience for user id: ${this.userId}`);
            return null;
        }
    }

    async deleteUserProfile() {
        try {
            const profile = await ProfileModal.findOneAndDelete({user: this.userId});
            if (profile) {
                return true
            }
        } catch (err) {
            this.logger.error(`Unable to delete user profile for user Id: ${this.userId}`);
            return false;
        }

        return false;
    }

    async updateProfileExperiences(experiences) {
        try {
            return await ProfileModal.findOneAndUpdate({user: this.userId}, {$set:{experiences: experiences}}, {new: true});
        } catch (err) {
            this.logger.error(`Unable to update profile experience for user id: ${this.userId}`);
            return null;
        }
    }

    static async addNewUserProfile(profile) {
        try {
            const newProfile = new ProfileModal(profile);
            return await newProfile.save();
        } catch (err) {
            const logger = new Logger(__filename);
            logger.error(`Unable to add profile for user`);
            return null;
        }
    }

    static async getProfilesFromInstituteId(instituteId) {
        try {
            return await ProfileModal.find({'educations.institute': instituteId});
        } catch (err) {
            const logger = new Logger(__filename);
            logger.error`Unable to get profile for institute id: ${instituteId}, err: ${err}`;
            return null;
        }
    }
}


module.exports = UserProfile;
