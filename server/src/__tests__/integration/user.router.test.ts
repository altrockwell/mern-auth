import request, { Response } from 'supertest';
import app from '../../app';
import dbSetUp from '../../dbSetUp';
import User from '../../modules/user/user.model';
import { issueJWT } from '../../modules/user/user.utils';
const passport = require('passport');
const util = require('../../modules/user/user.utils');

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

	describe('GET /auth/google --> redirected', () => {
		const exec = () => {
			return request(app).get('/auth/google');
		};
		test('user will be redirected to google auth', async () => {
			const res = await exec();

			expect(res.statusCode).toBe(302);
			expect(res.headers.location).toMatch(/accounts.google.com/);
		});
	});

	describe('GET /auth/google/callback --> userToken', () => {
		let code: string;
		let scope: string;
		const exec = () => {
			return request(app).get(`/auth/google/callback?code=${code || ''}&scope=${scope || ''}`);
		};

		describe('request will be fail', () => {
			test('if code and scope is missing', async () => {
				const res = await exec();

				expect(res.statusCode).toBe(400);
			});
		});
		describe('request will succeed', () => {
			beforeEach(() => {
				code = 'someValidCode';
				scope = 'someValidScope';
				util.issueJWT = jest.fn();
			});
			afterEach(() => {
				jest.resetAllMocks();
			});
			test('if code and scope is provided', async () => {
				const res = await exec();

				expect(res.statusCode).toBe(200);
			});
			test('if passport authenticate is called', async () => {
				passport.authenticate = jest.fn();
				await exec();

				expect(passport.authenticate).toHaveBeenCalled();
				expect(passport.authenticate.mock.calls[0][0]).toMatch(/google/);
			});
			test('if jwt token is issued and returned', async () => {
				util.issueJWT = jest.fn();

				const res = await exec();

				expect(util.issueJWT).toHaveBeenCalled();
				expect(res.body).toHaveProperty('token');
				expect(res.body).toHaveProperty('expires');
			});
		});
	});

	describe('GET /auth/facebook', () => {
		const exec = () => {
			return request(app).get('/auth/facebook');
		};

		test('user will be redirected', async () => {
			const res = await exec();

			expect(res.statusCode).toBe(302);
			expect(res.headers.location).toMatch(
				/https:\u002F\u002Fwww.facebook.com\u002Fv3.2\u002Fdialog\u002Foauth/
			);
		});
	});

	describe('GET /auth/facebook/callback', () => {
		let code: string;
		const exec = () => {
			return request(app).get(`/auth/facebook/callback?code=${code || ''}`);
		};

		describe('request will be denied ', () => {
			test('if code is missing', async () => {
				const res = await exec();

				expect(res.statusCode).toBe(400);
			});
		});
		describe('request will be succeed ', () => {
			test('if code is provided', async () => {
				code = 'someValidCode';
				// passport.authenticate = jest.fn();
				const res = await exec();

				expect(res.statusCode).toBe(200);
			});
			test('if passport authenticate is called', async () => {
				passport.authenticate = jest.fn();
				await exec();

				expect(passport.authenticate).toHaveBeenCalled();
				expect(passport.authenticate.mock.calls[0][0]).toMatch(/facebook/);
			});
			test('if jwt token is issued and returned', async () => {
				util.issueJWT = jest.fn();

				const res = await exec();

				expect(util.issueJWT).toHaveBeenCalled();
				expect(res.body).toHaveProperty('token');
				expect(res.body).toHaveProperty('expires');
			});
		});

		// test('redirect user to login to facebook if no code is provided', async () => {
		// 	const res = await exec();
		// 	// console.log(res.headers.location);
		// 	expect(res.statusCode).toBe(302);
		// 	expect(res.headers.location).toMatch(
		// 		/https:\u002F\u002Fwww.facebook.com\u002Fv3.2\u002Fdialog\u002Foauth/
		// 	);
		// });
	});
});
