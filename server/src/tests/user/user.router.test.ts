const userService = require('./../../services/user.service');
const jwt = require('../../utils/jwt.util');
import passport from 'passport';
import request from 'supertest';
import app from '../../app';

const sampleUser = { uuid: 'a@a.com', name: 'a@a.com', password: 'password' };

beforeEach(() => {
	jest.resetAllMocks();
});

describe('POST /auth/login', () => {
	describe('when email and password is given', () => {
		test.todo('calls findOrCreate');

		test('return json object containing accessToken and expires', async () => {
			userService.findOrCreate = jest.fn().mockResolvedValue(sampleUser);
			passport.authenticate = jest.fn();
			jwt.issueJWT = jest.fn().mockResolvedValue({
				token: 'Bearer ',
				expires: 'f',
			});
			const res = await request(app)
				.post('/auth/login')
				.send(sampleUser)
				.set('Accept', 'application/json');

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('token');
		});
	});
	describe('when email and password is missing', () => {
		test('return status code of 400', async () => {
			const requestData = [{ password: 'password' }, { uuid: 'a@a.com' }];
			requestData.forEach(async (data) => {
				const res = await request(app).post('/auth/login').send(data).set('Accept', 'application/json');
				expect(res.statusCode).toBe(400);
			});
		});
	});
	describe('when email and password is invalid', () => {
		it.todo('return status code of 400');
	});
});

describe('POST /auth/google', () => {
	passport.authenticate = jest.fn();
	test('redirect to google auth', async () => {
		const res = await request(app).post('/auth/google');

		expect(res.headers.location).toContain('https://accounts.google.com/o/oauth2/v2/auth');
	});
});

describe('POST /auth/google/callback', () => {
	passport.authenticate = jest.fn();
	test.todo('call issueJWT');
	test.todo('call query-string');
	test.todo('redirects to home');
});
