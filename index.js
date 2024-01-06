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

// Initialize Express app
const app = express();

// server setup 
const server = app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`)
})
//unexpected error handling
process.on("uncaughtException", (err) => {
    console.log(`Logged Error from index js: ${err.stack}`);
    server.close(() => process.exit(1));
})
// Connecting to Database 
mongoose.connect(MONGODB_URL).then(() => {
    console.log("Connected to Database")
}).catch((err) => console.log(err))

app.use(
    cookieSession({
        name: "session",
        keys: ["bharatescrow"],
        maxAge: 24 * 60 * 60 * 100,
    })
);
app.use(passport.initialize())
app.use(passport.session())
// Configure Middleware
app.use(cors({
    origin: "http://localhost:5173",
    // origin: "https://realestate.bharatescrow.com/",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
app.use(session({
    secret: 'realstate',
    resave: false,
    saveUninitialized: true,
}))
app.use(bodyParser.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/api/v1/', require('./routes'))

// ------------------------CONTINUE WITH GOOGLE start------------------------


//Routes
app.get("/", (req, res) => {
    res.send("Server is up and running on port " + PORT)
})



