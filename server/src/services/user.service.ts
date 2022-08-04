import User, { IUser } from '../models/user.model';

export const create = async (user: IUser) => {
	const newUser = await new User(user);
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
export const sampleFind = async (user: IUser) => {
	const foundUser = await find(user);
	return foundUser;
};
