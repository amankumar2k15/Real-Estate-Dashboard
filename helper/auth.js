const passport = require('passport');
const UserModelDashboard = require('../model/userModelDashboard');
require("dotenv").config()

let GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4400/google/callback",
    passReqToCallback: true
},
    //     function (request, accessToken, refreshToken, profile, done) {
    //         return done(null, profile);
    //     }
    // ));


    // passport.serializeUser(function (user, done) {
    //     done(null, user);
    // });

    // passport.deserializeUser(function (user, done) {
    //     done(null, user);
    // });




    function (accessToken, refreshToken, profile, done) {
        // Find or create a user in your database
        UserModelDashboard.findOne({ email: profile.email }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log(user)
                // If the user doesn't exist, create a new one with default values
                // user = new UserModelDashboard({
                //     email: profile.email,
                //     username: profile.displayName,
                //     // Add other default values here
                // });
                user.save((err) => {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
    }
));

// Serialize user to store in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
    UserModelDashboard.findById(id, (err, user) => {
        done(err, user);
    });
});
