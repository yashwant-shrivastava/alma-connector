const jwt = require('jsonwebtoken');
const config = require('config');

const validate = function (req, res, next) {
    // get token from header
    token = req.header('x-auth-token');

    try {
        let decoded = jwt.verify(token, config.get('JWT_SECRET_TOKEN'));
        let user = decoded.user;
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({'message': 'Server Error'});
    }
}

module.exports = validate;
