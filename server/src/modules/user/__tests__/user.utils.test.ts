import { isPasswordValid } from './../user.utils';
import { issueJWT, encryptPassword } from '../user.utils';
import UserModel, { IUser } from '../user.model';
import * as db from '../../../startapp/db';
import User from '../user.model';
import { Document, Types } from 'mongoose';
const jsonWebToken = require('jsonwebtoken');

describe('User Utils', () => {
	describe('issueJWT', () => {
		beforeAll(async () => {
			await db.connect();
		});
		afterAll(async () => {
			await db.disconnect();
		});
		let user: Document<unknown, any, IUser> &
			IUser & {
				_id: Types.ObjectId;
			};
		beforeEach(async () => {
			// create new user
			user = await new User({ uuid: 'a@a.com', password: 'password' }).save();
		});
		afterEach(async () => {
			await User.deleteMany({});
		});
		test('it will return token and expiration', async () => {
			const jwt = await issueJWT(user);

			// console.log(jwt);

			expect(jwt).not.toBe(undefined);
			expect(jwt).toBeTruthy();
			expect(jwt).toHaveProperty('token');
			expect(jwt).toHaveProperty('expires');
		});
		test('it will throw error', async () => {
			jsonWebToken.sign = jest.fn(() => {
				throw new Error();
			});
			// const jwt = await issueJWT(user);
			expect(() => issueJWT(user)).rejects.toThrowError();
			expect(jsonWebToken.sign).toBeCalled();
		});
	});

	describe('encryptPassword', () => {
		const password = 'password';
		test('if it does not return plain text password', async () => {
			const res = await encryptPassword(password);

			expect(res).not.toBe(password);
		});
	});

	describe('isPasswordValid', () => {
		let password = 'password';
		let hashedPassword: string;
		const exec = () => {
			return isPasswordValid(password, hashedPassword);
		};
		beforeEach(async () => {
			hashedPassword = await encryptPassword(password);
		});
		test('return false when password is invalid', async () => {
			password = 'password123';
			const res = await exec();

			expect(res).toBe(false);
		});
		test('return true when password is valid', async () => {
			const res = await exec();

			expect(res).toBe(true);
		});
	});
});
