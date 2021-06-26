const User = require('../services/user');
const getUserFromToken = require('../middlewares/auth_token');

exports.validate = (method) => {
    switch (method) {
        case 'userIdFromToken': {
            return getUserFromToken;
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
