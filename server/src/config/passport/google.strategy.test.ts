const service = require('./../../../services/user.service');
import { verify } from './__tests__/google.strategy';

let done: any;
const sampleProfile = {
	id: '',
	profileUrl: '',
	_raw: '',
	_json: {
		iss: '',
		azp: undefined,
		aud: '',
		sub: '',
		at_hash: undefined,
		iat: 0,
		exp: 0,
		email: 'email@email.com',
		email_verified: undefined,
		given_name: undefined,
		family_name: undefined,
		name: undefined,
		hd: undefined,
		locale: undefined,
		nonce: undefined,
		picture: undefined,
		profile: undefined,
	},
	provider: '',
	displayName: '',
};
beforeEach(() => {
	jest.resetAllMocks();
	service.findOrCreate = jest.fn();
	done = jest.fn();
});
describe('STRATEGY google', () => {
	describe('when findOrCreate working properly', () => {
		test('calls findOrCreate function', () => {
			verify('accessToken', 'refreshToken', sampleProfile, done);
			expect(service.findOrCreate).toHaveBeenCalled();
		});
		test('calls done(null,user)', async () => {
			const user = service.findOrCreate();
			await verify('accessToken', 'refreshToken', sampleProfile, done);

			expect(done).toHaveBeenCalled();
			expect(done).toHaveBeenCalledWith(null, user);
		});
	});

	describe('when findOrCreate is not working properly', () => {
		service.findOrCreate = jest.fn(() => {
			throw new Error();
		});
		expect(() => verify('accessToken', 'refreshToken', sampleProfile, done)).rejects.toThrow(Error);
	});
});
