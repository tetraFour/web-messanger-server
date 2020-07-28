import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserModel } from '~/models';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export default passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const user = await UserModel.findOne({ login: payload.login });
      if (user) {
        console.log('PASSPORT: user was found!');
        done(null, user);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
    } catch (error) {
      done(null, false);
      console.log(error);
    }
  }),
);
