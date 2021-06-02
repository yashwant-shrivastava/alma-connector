const UserModel = require('../models/user');
const logger = require('../utils/logger');

class User {
    constructor(userId) {
        this.userId = userId;
    }

    static async getUserFromUserId() {
        try {
            const user = await UserModel.findOne({id: this.userId});
            return user;
        } catch (err) {
            logger.info`Unable to get user for userId: {this.userId}, error: {err}`;
            return null;
        }
    }
}


module.exports = User;
