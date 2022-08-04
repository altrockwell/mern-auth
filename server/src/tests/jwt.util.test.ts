import { issueJWT } from './../utils/jwt.util';
import jsonWebToken from 'jsonwebtoken';
import User from '../models/user.model';
describe('issueJWT', () => {
	// it should return token
	test('it should return token', () => {
		jsonWebToken.sign = jest.fn();
		const res = issueJWT(new User({ uuid: 'a@a.com', name: 'a@a.com', password: 'password' }));
		expect(res).toHaveProperty('token');
		expect(res).toHaveProperty('expires');
	});
});
