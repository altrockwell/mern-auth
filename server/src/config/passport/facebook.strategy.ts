import { Strategy } from 'passport-facebook';
import User from '../../modules/user/user.model';

const options = {
	clientID: process.env.FACEBOOK_APP_ID as string,
	clientSecret: process.env.FACEBOOK_APP_SECRET as string,
	callbackURL: '/auth/facebook/callback',
};

const verify = (accessToken: string, refreshToken: string, profile: any, done: any) => {
	try {
		const user = User.findOrCreate({ uuid: profile._json.email || profile.id });
		return done(null, user);
	} catch (error) {
		console.log(error);
		return done(error, false);
	}
};

export default new Strategy(options, verify);
