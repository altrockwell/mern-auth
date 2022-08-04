import { Strategy as LocalStrategy } from 'passport-local';
import { findOrCreate } from '../../services/user.service';

const options = {
	usernameField: 'uuid',
	passwordField: 'password',
	session: false,
};
export const verify = async (username: string, password: string, done: any) => {
	try {
		const user = await findOrCreate({ uuid: username, password: password, name: username });
		return done(null, user);
	} catch (error) {
		return done(error, false);
	}
};
export default new LocalStrategy(options, verify);
