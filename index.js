const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
require("dotenv").config()
const jwt = require('jsonwebtoken')

// ------------------------CONTINUE WITH GOOGLE start------------------------
const passport = require("passport");
const session = require("express-session");
const { success } = require("./helper/baseResponse");

//middleware
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401)
}
// ------------------------CONTINUE WITH GOOGLE ends------------------------

// Initialize Express app
const app = express();
require("./helper/auth")
// Configure Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods : "GET,POST,PUT,DELETE",
    credentials : true,
}));
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     next();
// })
app.use(bodyParser.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// ------------------------CONTINUE WITH GOOGLE start------------------------
app.use(session({ secret: "cats" }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/v1/', require('./routes'))


//Routes
app.get("/", (req, res) => {
    res.send('<a href="auth/google">Authenticate with GOOGLE</a>')
})

app.get("/register",
    passport.authenticate("google", { scope: ['email', 'profile'] })
);

app.get("/google/callback",
    passport.authenticate("google", { successRedirect: 'http://localhost:5173/dashboard/home' , failureRedirect : "http://localhost:5173/auth/sign-in" },async (req,res)=>{
        let payload = {
            username: req.user.username,
            role: req.user.role,
            id: req.user._id
        }
        const options = {
            expiresIn: '1d', // Token will expire in one day
        };
        const jwt_token = await jwt.sign(payload, process.env.JWT_KEY, options);
        console.log("req accepted-----------------------------------------", req.user)
        // res.send(jwt_token)
        res.status(200).json(success("Logged in ", {text: `${req.user.username}, logged in `, token: jwt_token }, 200));
    })
)

app.get("/login/success", async (req, res) => {
    let payload = {
        username: req.user.username,
        role: req.user.role,
        id: req.user._id
    }
    const options = {
        expiresIn: '1d', // Token will expire in one day
    };
    const jwt_token = await jwt.sign(payload, process.env.JWT_KEY, options);
    console.log("req accepted-----------------------------------------", req.user)
    // res.send(jwt_token)
    res.status(200).json(success("Logged in ", {text: `${req.user.username}, logged in `, token: jwt_token }, 200));
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
