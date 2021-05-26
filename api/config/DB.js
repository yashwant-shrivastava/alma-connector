const mongoose = require('mongoose');
const config = require('config');
const db = config.get('MONGO_URI');

const connectDB = async () => {
    try {
        console.log(db);
        await mongoose.connect(db, {
            "useNewUrlParser": true,
            "useCreateIndex": true,
            "useUnifiedTopology": true
        });
        return "Connected to DB";
    } catch (err) {
      return "Not able to connect to db";
        process.exit(1);
    }
}

module.exports = connectDB;
