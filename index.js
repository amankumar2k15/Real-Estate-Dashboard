const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
require("dotenv").config()
const cookieSession = require("cookie-session");
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.DB_URL
const passport = require("passport");
const session = require("express-session");
require("./helper/auth")
const multer  = require('multer')

// Initialize Express app
const app = express();

// Configure Middleware
app.use(cors());
app.use(session({
    secret: 'realstate',
    resave: false,
    saveUninitialized: true,
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//unexpected error handling


// Create a multer instance
const upload = multer();

// Use multer middleware to parse form-data
app.use(upload.any());



// server setup 
const server = app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`)
})

process.on("uncaughtException", (err) => {
    console.log(`Logged Error from index js: ${err.stack}`);
    server.close(() => process.exit(1));
})
// Connecting to Database 
mongoose.connect(MONGODB_URL).then(() => {
    console.log("Connected to Database")
}).catch((err) => console.log(err))
// app.use(
//     cookieSession({
//         name: "session",
//         keys: ["bharatescrow"],
//         maxAge: 24 * 60 * 60 * 100,
//     })
// );


app.use('/api/v1/', require('./routes'))

// ------------------------CONTINUE WITH GOOGLE start------------------------


//Routes
app.get("/", (req, res) => {
    res.send("Server is up and running on port " + PORT)
})



