import { encryptPassword } from './../utils/bcrypt.util';
import User, { IUser } from '../models/user.model';

export const create = async (user: IUser) => {
	let password = user.password;
	if (user.password) {
		password = await encryptPassword(user.password);
	}
	const newUser = await new User({ uuid: user.uuid, name: user.name, password: user.password });
	await newUser.save();
	return newUser;
};

export const find = async (user: IUser) => {
	const foundUser = await User.findOne(user);
	return foundUser;
};

export const findOrCreate = async (user: IUser) => {
	const foundUser = await find(user);
	if (!foundUser) {
		const newUser = await create(user);
		return newUser;
	}
	return foundUser;
};
