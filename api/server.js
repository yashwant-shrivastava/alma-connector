const express = require('express');
const connectDB = require('./config/DB');
const user = require('./routes/user');
const profile = require('./routes/profile');
const geo = require("./routes/geo");
const institute = require("./routes/institute");
const post = require('./routes/post');
const Logger = require('./utils/logger');
const path = require('path');
const logger = new Logger(__filename);

const app = express();

connectDB().then(r => logger.info(r));

app.use(express.json());

// user routes
app.use("/api/user", user);

// profile routes
app.use("/api/profile", profile);

// geo routes
app.use("/api/geo", geo);

// institute routes
app.use("/api/institute", institute);

// posts routes
app.use("/api/post", post);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/public/index.html'));
});

// index
app.get("/", (req, res) => {res.send("Working the express app inside docker with hot reloading :)")});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`app running at port ${PORT}`));
