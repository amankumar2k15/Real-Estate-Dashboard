const passport = require('passport');
const UserModelDashboard = require('../model/userModelDashboard');
require("dotenv").config()
const jwt = require('jsonwebtoken')

let GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:4400/google/callback",
  passReqToCallback: true
},

  async (request, accessToken, refreshToken, profile, done) => {
    //get the user data from google 
    const newUser = {
      googleId: profile.id,
      username: profile.displayName,
      profile: profile.photos[0].value,
      email: profile.emails[0].value,
      role: profile.emails[0].value === "shashanksharma1235999@gmail.com" ? "super-admin" : null
    }

    let user = await UserModelDashboard.findOne({ googleId: profile.id })
    if (user) {
      done(null, user)
    } else {
      // if user is not preset in our database save user data to database.
      user = await new UserModelDashboard(newUser);
      user.save()
      done(null, user)
    }
  }
));

// Serialize user to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModelDashboard.findById(id).exec();
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});