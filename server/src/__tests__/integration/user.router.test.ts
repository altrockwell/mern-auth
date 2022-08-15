import jsonWebToken from 'jsonwebtoken';
import app from '../../app';
import dbSetUp from '../../dbSetUp';
import User from '../../modules/user/user.model';
import { issueJWT } from '../../modules/user/user.utils';

const request = require('supertest');

dbSetUp();

let sampleUser: any;

beforeEach(async () => {
	await jest.resetAllMocks();
	sampleUser = { uuid: 'a@a.com', password: 'aA1@aA1@' };
});
afterEach(async () => {
	await User.deleteMany({});
});

describe('User Router Test', () => {
	const invalidRequests = [
		{ data: { uuid: 'aaaaa', password: 'aA1@aA1@' }, errorMessage: 'uuid is not a valid email' },
		{ data: { uuid: 123456, password: 'aA1@aA1@' }, errorMessage: 'uuid is not string' },
		{ data: { uuid: 'a@a.com', password: 1234567 }, errorMessage: 'password is not string' },
		{
			data: { uuid: new Array(256).join('A').toString() + '@gmail.com', password: 'aA1@aA1@' },
			errorMessage: 'uuid exceeds 255 characters',
		},
		{ data: { password: 'password1234' }, errorMessage: 'uuid is missing' },
		{
			data: { uuid: 'a@a.com', password: 'pA1@' },
			errorMessage: 'password least than 6 characters',
		},
		{ data: { uuid: 'a@a.com' }, errorMessage: 'password is missing' },
		{ data: {}, errorMessage: 'uuid and password is missing' },
	];
	describe('POST /auth/register --> userToken', () => {
		const exec = () => {
			return request(app).post('/auth/register').send(sampleUser);
		};

		describe('request will be denied', () => {
			invalidRequests.forEach((invalidRequest) => {
				test('if ' + invalidRequest.errorMessage, async () => {
					sampleUser = invalidRequest.data;
					const res = await exec();
					expect(res.statusCode).toBe(400);
				});
			});
		});
		describe('request will succeed', () => {
			test('if request body is valid', async () => {
				const res = await exec();
				expect(res.statusCode).toBe(200);
			});
			test('if user is saved in DB', async () => {
				await exec();
				const findNewUser = await User.findOne({ uuid: sampleUser.uuid });

				expect(findNewUser).toBeTruthy();
			});
			test('if jwt token is issued', async () => {
				const res = await exec();

				expect(res.body).toHaveProperty('token');
				expect(res.body).toHaveProperty('expires');
			});
		});
	});

	describe('POST /auth/login --> userToken', () => {
		const exec = () => {
			return request(app).post('/auth/login').send(sampleUser);
		};

		describe('request will be denied', () => {
			invalidRequests.forEach((invalidRequest) => {
				test('if ' + invalidRequest.errorMessage, async () => {
					sampleUser = invalidRequest.data;
					const res = await exec();
					expect(res.statusCode).toBe(400);
				});
			});
			test('if user does not exist', async () => {
				const res = await exec();
				expect(res.statusCode).toBe(401);
			});
			test('if password is incorrect', () => {});
		});
		describe('request will succeed', () => {
			beforeEach(async () => {
				await new User(sampleUser).save();
			});
			test('if request body is valid', async () => {
				const res = await exec();
				expect(res.statusCode).toBe(200);
			});
			test('if user is found in db', async () => {
				const user = await User.findOne({ uuid: sampleUser.uuid });
				await exec();

				expect(user).toBeTruthy();
			});
			test('if jwt token is issued', async () => {
				const res = await exec();

				expect(res.body.token).toBeTruthy();
				expect(res.body.token).toMatch(/Bearer/);
				expect(res.body.expires).toBeTruthy();
			});
		});
	});

	describe('GET /auth/profile --> userData', () => {
		let token: string;
		const exec = () => {
			return request(app)
				.get('/auth/profile')
				.set('Authorization', token || '');
		};
		beforeEach(() => {
			token = '';
		});
		describe('request will not be allowed', () => {
			test('if authorization header is not sent', async () => {
				const res = await exec();
				expect(res.statusCode).toBe(401);
			});
			test('if jwt token is invalid', async () => {
				token = 'someInvalidToken';
				const res = await exec();
				expect(res.statusCode).toBe(401);
			});
		});
		describe('request will succeed', () => {
			test('if authorization header sent is valid', async () => {
				const user = await new User(sampleUser).save();
				const jwt = await issueJWT(user);
				token = jwt.token;

				const res = await exec();

				expect(res.statusCode).toBe(200);
			});
		});
	});
});
