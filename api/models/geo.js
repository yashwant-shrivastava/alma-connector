const mongoose = require('mongoose');

const geoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    pincode: {
        type: Number,
        required: true,
        unique: false
    },
    geoType: {
        type: String,
        required: true,
        unique: false
    }
});

geoSchema.index({ name: 1, geoType: 1 }, { unique: true });

module.exports = geo = mongoose.model('geo', geoSchema);
