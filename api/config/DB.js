const mongoose = require('mongoose');
const config = require('config');
const db = config.get('MONGO_URI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            "useNewUrlParser": true,
            "useCreateIndex": true,
            "useUnifiedTopology": true,
            "useFindAndModify": false
        });
        return "Connected to DB";
    } catch (err) {
        process.exit(1);
    }
}

module.exports = connectDB;
