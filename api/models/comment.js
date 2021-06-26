const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    date: {
        type:Date,
        default: Date.now()
    }
});

module.exports = postComment = mongoose.model('comment', CommentSchema);