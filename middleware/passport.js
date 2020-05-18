const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findOne({ login: payload.login });
        if (user) {
          console.log("user was found!");
          done(null, user);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
      } catch (error) {
        done(null, false);
        console.log(error);
      }
    })
  );
};
