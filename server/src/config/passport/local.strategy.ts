import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../modules/user/user.model';

const options = {
	usernameField: 'uuid',
	passwordField: 'password',
	session: false,
};
export const verify = async (username: string, password: string, done: any) => {
	try {
		const user = await User.findOne({ uuid: username });
		if (!user) {
			return done(null, false);
		}
		return done(null, user);
	} catch (error) {
		return done(error, false);
	}
};
export default new LocalStrategy(options, verify);
