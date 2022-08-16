import { Profile, Strategy } from 'passport-google-oauth20';
import User from '../../modules/user/user.model';
require('dotenv').config();

const googleClient: string = process.env.GOOGLE_CLIENT_ID as string;
const googleSecret: string = process.env.GOOGLE_CLIENT_SECRET as string;

const googleStrategyConfig = {
	clientID: googleClient,
	clientSecret: googleSecret,
	callbackURL: '/auth/google/callback',
};
export const verify = async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
	try {
		const user = await User.findOrCreate({
			uuid: profile._json.email as string,
		});
		return done(null, user);
	} catch (err) {
		return done(err);
		// throw new Error(`${err}`);
	}
};

export default new Strategy(googleStrategyConfig, verify);
