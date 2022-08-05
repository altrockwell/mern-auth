import { verify } from './local.strategy';
const service = require('../../../services/user.service');

let done: any;
beforeEach(() => {
	jest.resetAllMocks();
	service.findOrCreate = jest.fn();
	done = jest.fn();
});
describe('local strategy', () => {
	describe('when username and password is given', () => {
		test('calls findOrCreate', () => {
			verify('a@a.com', 'password', done);

			expect(service.findOrCreate).toHaveBeenCalled();
		});

		test('return with done(null, user)', () => {
			done = jest.fn();
			const res = verify('a@a.com', 'password', done);

			expect(res).resolves.toBe(done(null, { uuid: 'a@a.com', password: 'password', name: 'a@a.com' }));
		});
	});
});
