const express = require('express');
const connectDB = require('./config/DB');
const user = require('./routes/user');

const app = express();

connectDB().then(r => console.log(r));

app.use(express.json());

// user routes
app.use("/api/user", user);

app.get("/", (req, res) => {res.send("Working the express app inside docker with hot reloading :)")});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`app running at port ${PORT}`));
