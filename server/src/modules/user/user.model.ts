import { Schema, model, Types, connect, Model, HydratedDocument } from 'mongoose';

export interface IUser {
	uuid: string; //could be uuid or email
	password?: string;
}

interface IUserModel extends Model<IUser> {
	findOrCreate(user: IUser): Promise<HydratedDocument<IUser>>;
}

const userSchema = new Schema<IUser, IUserModel>(
	{
		uuid: { type: String, unique: true, required: true, min: 5, max: 255 },
		password: { type: String, min: 6, max: 255 },
	},
	{ timestamps: true }
);

userSchema.static('findOrCreate', async function (user: IUser) {
	const uuid = user.uuid;
	const foundUser = await User.find({ uuid });
	if (!foundUser) {
		const newUser = await new User(user);
		await newUser.save();
		return newUser;
	}
	return foundUser;
});

const User = model<IUser, IUserModel>('User', userSchema);

export default User;
