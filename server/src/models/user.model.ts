import { Schema, model, Types, connect } from 'mongoose';

export interface IUser {
	_id?: Types.ObjectId;
	uuid: string; //could be uuid or email
	name: string | undefined; //could be name or email
	password?: string;
}

const userSchema = new Schema<IUser>(
	{
		uuid: { type: String, unique: true, required: true, min: 5, max: 255 },
		name: { type: String, min: 3, max: 255 },
		password: { type: String, min: 6, max: 255 },
	},
	{ timestamps: true }
);

export default model<IUser>('User', userSchema);
