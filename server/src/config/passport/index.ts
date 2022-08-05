import passport from 'passport';
import googleStrategy from './googleStrategy/google.strategy';
import localStrategy from './localStrategy/local.strategy';

export default function () {
	passport.use(localStrategy);
	passport.use(googleStrategy);

	passport.serializeUser((user: any, done: any) => done(null, user));
	passport.deserializeUser((user: any, done: any) => {
		return done(null, user);
	});
}
