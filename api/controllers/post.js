const Post = require('../services/post');
const getUserFromToken = require('../middlewares/auth_token');
const { check, validationResult } = require('express-validator');

exports.validate = (method) => {
    switch (method) {
        case 'createPost': {
            return [
                check('text', 'Text is compulsory').not().isEmpty(),
                getUserFromToken
            ];
        }

        case 'userIdFromToken': {
            return getUserFromToken
        }

        case 'createComments': {
            return [
                check('text', 'Text is compulsory').not().isEmpty(),
                getUserFromToken
            ];
        }
    }
}

exports.createPost = async function(req, res) {
    const userId = req.user;
    const text = req.body.text;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({'status': false, 'message': errors.array()});
    }

    if (!userId) {
        return res.status(422).json({'status': false, 'message': 'Invalid User Id'});
    }

    const post = await Post.createPost(userId, text);
    if (post) {
        return res.status(200).json({'status': true, 'post': post});
    }

    res.status(500).json({'status': false, 'message': 'Unable to create post'});
}

exports.deletePost = async function(req, res) {
    const userId = req.user;
    const postId = req.body.postId;
    if (!userId || !postId) {
        return res.status(422).json({'status': false, 'message': 'Invalid User Id or Post Id'});
    }

    const post = new Post(postId);
    const result = await post.deletePost(userId);

    if (result) {
        return res.status(200).json({'status': true, 'post': result});
    }

    return res.status(500).json({'status': false, 'message': 'Unable to delete post'});

}

exports.addLike = async function(req, res) {
    const userId = req.user;
    const postId = req.body.postId;
    if (!userId || !postId) {
        return res.status(422).json({'status': false, 'message': 'Invalid User Id or Post Id'});
    }

    const post = new Post(postId);
    const result = await post.addLike(userId);

    if (result) {
        return res.status(200).json({'status': true, 'post': result});
    }

    return res.status(500).json({'status': false, 'message': 'Unable to add new like'});
}


exports.removeLike = async function(req, res) {
    let userId = req.user;
    let postId = req.body.postId;
    if (!userId || !postId) {
        return res.status(422).json({'status': false, 'message': 'Invalid User Id or Post Id'});
    }

    const post = new Post(postId);
    let result = await post.removeLike(userId);
    if (!result) {
        return res.status(500).json({'status': false, 'message': 'Unable to remove like'});
    }

    return res.status(200).json({'status': true, 'post': result});
}


exports.addComment = async function(req, res) {
    const userId = req.user;
    const text = req.body.text;
    const postId = req.body.postId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({'status': false, 'message': errors.array()});
    }

    if (!userId) {
        return res.status(422).json({'status': false, 'message': 'Invalid User Id'});
    }

    const post = new Post(postId);
    const result = await post.addComment(userId, text);
    if (result) {
        return res.status(200).json({'status': true, 'post': result});
    }

    res.status(500).json({'status': false, 'message': 'Unable to add comment to post'});

}

exports.removeComment = async function(req, res) {
    const userId = req.user;
    const postId = req.body.postId;
    const commentId = req.body.commentId;

    if (!userId || !postId || !commentId) {
        return res.status(200).json({'status': false, 'message': "User id not found"});
    }

    let post = new Post(postId);
    let result = await post.removeComment(commentId);

    if (!result) {
        return res.status(500).json({'status': false, 'message': "Unable to delete comments"});
    }

    return res.status(200).json({'status': true, 'message': "comment deleted successfully"});
}
