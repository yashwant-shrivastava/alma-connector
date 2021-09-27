const UserModel = require('../models/user');
const Logger = require('../utils/logger');
const jwtService = require('../services/jwt');
const gravatar = require("gravatar");


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

    async static validateCredentials(email, password) {
        try {
            const user = await UserModel.findOne({email});

            if (!user) {
                return {
                    'status': false,
                    'message': "Invalid Credentials!!!"
                }
            }

            let isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                return {
                    'status': false,
                    'message': "Invalid Credentials!!!"
                }
            }

            let jwt = new jwtService();
            return jwt.getJWTTokenForUser(user.id);
        } catch (err) {
           return {
               'status': false,
               'message': 'Server Error'
           };
        }
    }

    async static registerNewUser(email, password, age, name) {
        try {
            let user = await UserModel.findOne({email});
            if (user) {
                return {
                    'status': false,
                    'message': "User Already Exists"
                }
            }

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new UserModel({
                name,
                email,
                age,
                password,
                avatar
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            let jwt = new jwtService();
            let result = jwt.getJWTTokenForUser(user.id);
            if (result.status && result.token) {
                return {'status': true, 'jwt': result.token};
            }

            return {'status': false, 'message': "Unable to register the user"};
        } catch (err) {
            return {'status': false, "message": "Server Error"};
        }
    }
}


module.exports = User;
