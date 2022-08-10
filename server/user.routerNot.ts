import request from 'supertest';
import app from './src/app';
import User, { IUser } from './src/modules/user/user.model';
import { issueJWT } from './src/modules/user/user.utils';
const util = require('../user.utils');

beforeEach(async () => {
	jest.resetAllMocks();
	requestData = { uuid: 'a@a.com', password: 'password' };
});
afterEach(async () => {
	await User.deleteMany({});
});

let requestData: any;

const invalidRequests = [
	{ uuid: 'notAnEmail', password: 'password123' }, //invalid uuid
	{ uuid: 123456, password: 'password123' }, //not string uuid
	{ uuid: 'a@a.com', password: 1234567 }, //not string password
	{ uuid: new Array(256).join('A').toString() + '@gmail.com', password: 'password123' }, //too long uuid
	{ password: 'password1234' }, //no uuid
	{ uuid: 'a@a.com', password: 'pass1' }, //short password
	{ uuid: 'a@a.com' }, //no password
	{}, //empty request
];
describe('POST /auth/register', () => {
	const exec = () => {
		return request(app).post('/auth/register').send(requestData);
	};

	describe('return status code 400', () => {
		test('when request is invalid', () => {
			invalidRequests.forEach(async (invalidRequest) => {
				requestData = invalidRequest;
				const res = await exec();

				expect(res.statusCode).toBe(400);
			});
		});
		test('when uuid is already taken', () => {});
	});

	describe('return status code 200 and token', () => {
		test('if user is valid', async () => {
			const res = await exec();
			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('expires');
		});
		test('if user is saved in DB', async () => {
			await exec();
			const findNewUser = await User.find({ uuid: requestData.uuid });

			expect(findNewUser.length).toBe(1);
		});
	});

	// 	test('jwt token is issued', async () => {
	// 		try {
	// 			// check issueJWT is called
	// 			util.issueJWT = jest.fn();
	// 			await request(app).post('/auth/register').send(requestData);
	// 			const foundUser = await User.findOne({ uuid: requestData.uuid });

	// 			expect(util.issueJWT).toHaveBeenCalled();
	// 			expect(util.issueJWT.mock.calls[0][0]).toHaveProperty('_id', foundUser?._id);
	// 			expect(util.issueJWT.mock.calls[0][0]).toHaveProperty('uuid', foundUser?.uuid);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	});
	// });
});

describe('POST /auth/login', () => {
	describe(' return status code 400 ', () => {
		test('when request is invalid', () => {
			invalidRequests.forEach(async (invalidRequest) => {
				const res = await request(app).post('/auth/login').send(invalidRequest);
				expect(res.statusCode).toBe(400);
			});
		});
		test(' if user is not in db', async () => {
			const res = await request(app).post('/auth/login').send(requestData);
			const foundUser = await User.findOne(requestData);

			expect(foundUser).toBeFalsy();
			expect(res.statusCode).toBe(400);
		});
	});

	describe('when request is valid', () => {
		test('return status code 200 and json object with token and expiration', async () => {
			util.issueJWT = jest.fn().mockResolvedValueOnce({ token: 'token', expires: 'expires' });
			const newUser = await new User(requestData);
			await newUser.save();
			const res = await request(app).post('/auth/login').send(requestData);

			expect(util.issueJWT).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('expires');
		});
	});
});

describe('GET /auth/profile', () => {
	let token: string;
	const exec = () => {
		return request(app).get('/auth/profile').set('Authorization', token);
	};

	beforeEach(async () => {
		// try {
		// 	requestData = { uuid: 'a@a.com', password: 'password' };
		// 	const newUser = await new User(requestData);
		// 	await newUser.save();
		// 	const jwt = await util.issueJWT(newUser);
		// 	if (!jwt) {
		// 		console.log('cannot produce jwt');
		// 	}
		// 	console.log(newUser, jwt);
		// } catch (error) {
		// 	console.log(error);
		// }
	});

	test('if jwt works', async () => {
		try {
			const newUser = await new User({ uuid: 'a@a.com', password: 'password' });
			await newUser.save();
			const jwt = await issueJWT(newUser);

			console.log(jwt);
			expect(jwt).toBeTruthy();
		} catch (error) {
			throw new Error(`${error}`);
		}
	});

	// describe('return status code 401', () => {
	// 	test("if request don't have authorization header", async () => {
	// 		token = '';
	// 		const res = await exec();

	// 		expect(res.statusCode).toBe(401);
	// 	});
	// 	test('if jwt sent is invalid', async () => {
	// 		token = 'someInvalidToken';
	// 		const res = await exec();

	// 		expect(res.statusCode).toBe(401);
	// 	});
	// });

	// describe('return status code 200', () => {
	// 	test('if token sent is valid', async () => {
	// 		console.log(token);
	// 		const res = await exec();

	// 		expect(res.statusCode).toBe(200);
	// 	});
	// });
});
