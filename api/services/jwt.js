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
            jwt.sign(
                { user: user_id },
                config.get('JWT_SECRET_TOKEN'),
                { expiresIn: 3600},
                (err, token) => {
                    if (err) {
                        throw err;
                    }

                    userToken = token;
                }
            )

            return {
                status: true,
                token: userToken
            };

        } catch (err) {
            return {
                status: false,
                message: err
            };
        }
    }
}

module.exports = JWT;
