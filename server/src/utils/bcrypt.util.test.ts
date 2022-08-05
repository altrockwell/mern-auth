import { encryptPassword } from './bcrypt.util';
import bcrypt from 'bcrypt';

describe('UTILS encrypt password', () => {
	const passwords = ['password', 'password123', 'hellosamplePassword123'];
	beforeEach(() => {
		jest.resetAllMocks();
		bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
		bcrypt.hash = jest.fn();
	});
	test('should call bycrpt.generateSalt function', () => {
		encryptPassword('password');

		expect(bcrypt.genSalt).toHaveBeenCalled();
	});
	test('should call bycrpt.hash function', async () => {
		const salt = await bcrypt.genSalt();
		passwords.forEach((password) => {
			bcrypt.hash(password, salt);
			encryptPassword(password);

			expect(bcrypt.hash).toHaveBeenCalled();
			expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
		});
	});
	test('should not return plain text', () => {
		passwords.forEach((password) => {
			const res = encryptPassword(password);

			expect(res).not.toBe(password);
		});
	});
});
