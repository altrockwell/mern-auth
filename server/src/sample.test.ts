import app from './app';
import * as db from './startapp/db';
import User, { IUser } from './modules/user/user.model';

let user: IUser;
describe('test database', () => {
	beforeAll(async () => {
		await db.connect();
	});

	afterAll(async () => {
		await User.deleteMany({});
		console.log('user deleted');

		await db.disconnect();
	});
	test('must exist', () => {
		expect(true).toBe(true);
	});
});
