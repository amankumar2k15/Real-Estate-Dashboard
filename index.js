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
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// Initialize Express app
const app = express();

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

// app.get("/register",
//     passport.authenticate("google", { scope: ['email', 'profile'] })
// );

// app.get("/google/callback",
//     passport.authenticate("google", { successRedirect : "http://localhost:5173/dashboard/home", failureRedirect : "http://localhost:5173/auth/sign-in" }),async (req,res)=>{
//         console.log(req);
//         let payload = {
//             username: req.user.username,
//             role: req.user.role,
//             id: req.user._id
//         }
//         const options = {
//             expiresIn: '1d', // Token will expire in one day
//         };
//         const jwt_token = await jwt.sign(payload, process.env.JWT_KEY, options);
//         console.log("req accepted-----------------------------------------", req.user)
//         res.send(jwt_token)
//         res.status(200).json(success("Logged in ", {text: `${req.user.username}, logged in `, token: jwt_token }, 200));
//     })




// ------------------------CONTINUE WITH GOOGLE ends------------------------




// Connecting to Database 
mongoose.connect(MONGODB_URL).then(() => {
    app.listen(PORT, function () {
        console.log(`Server is running on port ${PORT}`)
        console.log("Connected to Database")
    })
}).catch((err) => console.log(err))
