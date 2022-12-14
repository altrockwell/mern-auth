import passport from 'passport';
import googleStrategy from './google.strategy';
import localStrategy from './local.strategy';
import jwtStrategy from './jwt.strategy';
import facebookStrategy from './facebook.strategy';

export default function () {
	passport.use(localStrategy);
	passport.use(googleStrategy);
	passport.use(facebookStrategy);
	passport.use(jwtStrategy);

	passport.serializeUser((user: any, done: any) => done(null, user));
	passport.deserializeUser((user: any, done: any) => {
		return done(null, user);
	});
}
