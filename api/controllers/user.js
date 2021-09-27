const User = require('../services/user');
const getUserFromToken = require('../middlewares/auth_token');
const {validationResult} = require("express-validator");
const {check} = require("express-validator");

exports.validate = (method) => {
    switch (method) {
        case 'userIdFromToken': {
            return getUserFromToken;
        }

        case 'checkCredentials': {
            return [
                check('email', 'Please enter a valid email').isEmail(),
                check('password', 'Please enter a password').exists()
            ]
        }

        case 'validateInputForRegistration': {
            return [
                check('name').isLength({ min: 3 }),
                check('email', 'Please enter a valid email').isEmail(),
                check('age', 'Please enter correct age').isNumeric(),
                check('password', 'Password Length should have minimum 8 characters').isLength({ min: 8 })
            ]
        }
    }
}

exports.getUserById = async function(req, res) {
    const userId = req.user;
    if (!userId) {
        return res.status(200).json({'status': false, 'message': `Invalid User Id: ${userId}`});
    }

    const user = new User(userId);
    const result = await user.getUserFromUserId();
    return res.status(200).json({'status': true, 'user':  result})
}

exports.deleteUser = async function(req, res) {
    const userId = req.user;
    if (!userId) {
        return res.status(200).json({'status': false, 'message': `Invalid User Id: ${userId}`})
    }

    const user = new User(userId);
    const result = await user.deleteUser();
    return res.status(200).json({'status': result, 'message': `Deleted User Id: ${userId}`})
}

exports.validateCredentials = async function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({'status': false, errors: errors.array()});
        }

        const email = req.query.email;
        const password = req.query.password;

        const result = await User.validateCredentials(email, password);
        return res.status(200).json(result)
}

exports.registerUser = async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const name  = req.body.name;
    const email = req.body.email;
    const age   = req.body.age;
    const password = req.body.password;

    let result = User.registerNewUser(email, password, age, name);
    return res.status(200).json(result);
}