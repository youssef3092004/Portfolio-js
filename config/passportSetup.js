const passport = require('passport');
const User = require('../models/userModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create a new user if not found
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            fname: profile.name.givenName,
            lname: profile.name.familyName,
            username: profile.emails[0].value.split('@')[0],
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user._id); // Store only the user ID in the session
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id); // Fetch user details from the database
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
