import jsonWebToken from 'jsonwebtoken';
import { IUser } from '../models/user.model';

export const issueJWT = (user: IUser) => {
	const _id = user._id;

	const expiresIn = '2';

	const payload = {
		sub: {
			id: user._id,
			email: user.uuid,
			password: user.password || 'none',
		},
		iat: Date.now(),
	};

	const signedToken = jsonWebToken.sign(payload, 'secret', { expiresIn: expiresIn + ' days' });

	return {
		token: 'Bearer ' + signedToken,
		expires: expiresIn,
	};
};
