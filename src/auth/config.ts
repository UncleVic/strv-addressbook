// import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import { Users } from '../models/user.model';
import { secretOrKey, issuer, audience } from '../config';

// eslint-disable-next-line import/no-unresolved
// import bcrypt from 'bcrypt';

// passport.use(
//   new LocalStrategy(async (email, password, done) => {
//     try {
//       const user = await Users.findOne({ email });
//       if (user) {
//         return done(null, user, { message: 'Logged In Successfully' });
//       } else {
//         return done(null, false, { message: 'Login failed' });
//       }
//     } catch (error) {
//       return done(error, false, { message: 'Login failed' });
//     }
//   })
// );

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey,
  issuer,
  audience,
};

passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload: any, done: VerifiedCallback) => {
    try {
      const user = await Users.findOne({ email: jwtPayload.email });
      if (user) {
        return done(null, user, { message: 'Logged In Successfully' });
      } else {
        return done(null, false, { message: 'Login failed' });
      }
    } catch (error) {
      return done(error, false, { message: 'Login failed' });
    }
  })
);

export default passport;
