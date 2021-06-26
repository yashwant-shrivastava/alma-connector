const PostModal = require('./../models/post');
const CommentModal = require('./../models/comment');
const Logger = require("../utils/logger");
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

class Post {
    constructor(postId) {
        this.postId = postId;
        this.logger = new Logger(__filename);
    }

    static async createPost(userId, text) {
        const logger = new Logger(__filename)
        if (!userId || !text) {
            logger.info(`Invalid User id: ${userId} or text : ${text}`);
            return null;
        }

        try {
            const post = new PostModal();
            post.user = userId;
            post.text = DOMPurify.sanitize(text);
            return await post.save();

        } catch (err) {
            const logger = new Logger(__filename)
            logger.error(`Unable to create new post for userId: ${userId} and text: ${text}`);
        }

        return null;
    }

    async deletePost(userId) {
        if (!userId || !this.postId) {
            this.logger.info("Invalid user id or post id to add likes");
            return null;
        }

        try {
            const post = await PostModal.findById(this.postId);
            post.active = false;
            return await post.save();
        } catch (err) {
            this.logger.error(`Unable to add likes for post by user id: ${userId}`);
        }

        return null;
    }

    async addLike(userId) {
        if (!userId || !this.postId) {
            this.logger.info("Invalid user id or post id to add likes");
            return null;
        }

        try {
            const post = await PostModal.findById(this.postId);
            post.likes.addToSet(userId);
            return await post.save();
        } catch (err) {
            this.logger.error(`Unable to add likes for post by user id: ${userId}, error: ${err}`);
        }

        return null;
    }

    async removeLike(userId) {
        if (!userId || !this.postId) {
            this.logger.info("Invalid user id or post id to add likes");
            return null;
        }

        try {
            const post = await PostModal.findById(this.postId);
            post.likes.remove(userId);
            return await post.save();
        } catch (err) {
            this.logger.error(`Unable to remove likes for post by user id: ${userId}`);
        }

        return null;
    }

    async addComment(userId, text) {
        if (!userId || !text || !this.postId) {
            this.logger.info("Invalid user id or post id to add likes");
            return null;
        }

        try {
            const comment = new CommentModal()
            comment.user = userId;
            comment.text = DOMPurify.sanitize(text);
            const result = await comment.save()
            if (!result) {
                this.logger.error(`Unable to create new comment for text: ${text}, user id: ${text}`);
                return null;
            }

            const post = await PostModal.findById(this.postId);
            post.comments.addToSet(comment)
            return await post.save();
        } catch (err) {
            this.logger.error(`Unable to add comments for post by user id: ${userId}, error: ${err}`);
        }

        return null
    }

    async removeComment(commentId) {
        if (!commentId || !this.postId) {
            this.logger.error(`Unable to remove comment for comment id: ${commentId}, post id: ${this.postId}`);
            return null;
        }

        try {
            const comment = await CommentModal.findByIdAndUpdate(commentId, {$set: {active: false}});
            if (!comment) {
                this.logger.error(`Unable to remove comment for comment id: ${commentId}`);
                return null;
            }

            const post = await PostModal.findById(this.postId);
            post.comments.remove(commentId);
            return await post.save()
        } catch (err) {
            this.logger.error(`Unable to remove comment for comment id: ${commentId}, err: ${err}`);
        }

        return null;
    }
}

module.exports = Post;