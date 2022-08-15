import bycrpt from 'bcrypt';
import jsonWebToken from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import { IUser } from './user.model';

export const encryptPassword = async (password: string): Promise<string> => {
	try {
		const salt = await bycrpt.genSalt(10);
		return await bycrpt.hash(password, salt);
	} catch (error) {
		throw new Error('Error in generating salt');
	}
};

export const isPasswordValid = async (password: string, hashedPassword: string): Promise<boolean> => {
	return await bycrpt.compare(password, hashedPassword);
};

export const issueJWT = async (user: HydratedDocument<IUser>) => {
	try {
		const expiresIn = '2';

		const payload = {
			sub: {
				id: user._id,
				uuid: user.uuid,
				// password: user.password || 'none',
			},
			iat: Date.now(),
		};

		const signedToken = await jsonWebToken.sign(payload, 'secret', { expiresIn: `${expiresIn} days` });

		return {
			token: 'Bearer ' + signedToken,
			expires: expiresIn,
		};
	} catch (error) {
		throw new Error(`${error}`);
	}
};
