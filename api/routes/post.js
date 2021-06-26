const express = require('express');
const router = express.Router();
const postController = require('./../controllers/post');

router.post('/create', postController.validate('createPost'), postController.createPost);

router.post('/delete', postController.validate('userIdFromToken'), postController.deletePost);

router.post('/addLike', postController.validate('userIdFromToken'), postController.addLike);

router.post('/removeLike', postController.validate('userIdFromToken'), postController.removeLike);

router.post('/addComment', postController.validate('createComments'), postController.addComment);

router.post('/removeComment', postController.validate('userIdFromToken'), postController.removeComment);

module.exports = router;