const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const UserModelDashboard = require('./model/userModelDashboard');
require("dotenv").config()
// ------------------------CONTINUE WITH GOOGLE start------------------------
const passport = require("passport");
const session = require("express-session")
require("./helper/auth")

//middleware
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401)
}
// ------------------------CONTINUE WITH GOOGLE ends------------------------

// Initialize Express app
const app = express();

// Configure Middleware
app.use(cors())
app.use(bodyParser.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// ------------------------CONTINUE WITH GOOGLE start------------------------
app.use(session({ secret: "cats" }))
app.use(passport.initialize())
app.use(passport.session())


//Routes
app.get("/", (req, res) => {
    res.send('<a href="auth/google">Authenticate with GOOGLE</a>')
})

app.get("/auth/google",
    passport.authenticate("google", { scope: ['email', 'profile'] })
);

app.get("/google/callback",
    passport.authenticate("google", { successRedirect: '/protected' })
)

app.get("/protected", isLoggedIn, (req, res) => {
    console.log("req accepted", req.user)
    res.send("Hello I'm Protected")
})

// ------------------------CONTINUE WITH GOOGLE ends------------------------


const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.DB_URL

// Connecting to Database 
mongoose.connect(MONGODB_URL).then(() => {
    app.listen(PORT, function () {
        console.log(`Server is running on port ${PORT}`)
        console.log("Connected to Database")
    })
}).catch((err) => console.log(err))
