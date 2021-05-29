const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        address1: {
            type: String,
            required: true
        },
        address2: {
          type: String
        },
        address3: {
          type: String
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'geo',
            required: true
        }
    },
    estd: {
        type: Number,
        required: true
    }
});

module.exports = institute = mongoose.model('institute', instituteSchema);
