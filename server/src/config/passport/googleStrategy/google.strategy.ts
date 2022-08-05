import { findOrCreate } from '../../../services/user.service';
import { Profile, Strategy } from 'passport-google-oauth20';

const googleClient: string = process.env.GOOGLE_CLIENT_ID as string;
const googleSecret: string = process.env.GOOGLE_CLIENT_SECRET as string;

const googleStrategyConfig = {
	clientID: googleClient,
	clientSecret: googleSecret,
	callbackURL: '/auth/google/callback',
};
export const verify = async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
	try {
		const user = await findOrCreate({
			uuid: profile._json.email as string,
			name: profile._json.email,
		});

		return done(null, user);
	} catch (err) {
		return done(err);
	}
};

export default new Strategy(googleStrategyConfig, verify);
