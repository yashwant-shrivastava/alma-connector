const UserModel = require('../models/user');
const Logger = require('../utils/logger');

class User {
    constructor(userId) {
        this.userId = userId;
        this.logger = new Logger(__filename);
    }

    async getUserFromUserId() {
        try {
            await UserModel.findById(this.userId, '-password', function(err, result) {
                if (err) {
                    throw err;
                }
                return result;
            });
        } catch (err) {
            return null;
        }

        return null;
    }

    async deleteUser() {
        try {
            const deleteUser = await UserModel.findByIdAndDelete(this.userId);
            if (deleteUser.deletedCount) {
                return true;
            }
        } catch (err) {
            this.logger.error(`Unable to delete user for userId: ${this.userId}, error: ${err}`)
            return null;
        }
        return false;
    }
}


module.exports = User;
