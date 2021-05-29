const config = require('config');
const jwt = require('jsonwebtoken');

class JWT {
    getJWTTokenForUser(user_id) {
        if (!user_id) {
            return {
                status: false,
                message: "Invalid user id"
            };
        }

        try {
            let userToken = null;
            return {
                status: true,
                token: jwt.sign(
                    { user: user_id },
                    config.get('JWT_SECRET_TOKEN'),
                    { expiresIn: 3600 }
                )
            }
        } catch (err) {
            return {
                status: false,
                message: err
            };
        }
    }
}

module.exports = JWT;
