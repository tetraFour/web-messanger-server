import passport from 'passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserModel } from '~/models';

const cookieExtract = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.ut;
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtract,
  secretOrKey: process.env.JWT_SECRET,
};

class Passport {
  constructor() {
    this.initPassportConfig();
  }

  private initPassportConfig = () =>
    passport.use(
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
}

export default new Passport();
