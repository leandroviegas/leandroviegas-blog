
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
})
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_AUTH_CLIENTID,
  clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  callbackURL: `${process.env.URL}/auth/callback`,
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));