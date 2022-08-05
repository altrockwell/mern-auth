import { encryptPassword, isPasswordValid } from './bcrypt.util';
import bcrypt from 'bcrypt';

describe('UTILS encryptPassword', () => {
	describe('when bcrypt is working properly', () => {
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
	describe('when bcrypt is not working properly', () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});
		test('throw error when genSalt function is not working', async () => {
			bcrypt.genSalt = jest.fn(() => {
				throw new Error('Error in generating salt');
			});
			expect(() => encryptPassword('password')).rejects.toThrow(Error);
		});
		test('throw error when hash function is not working', async () => {
			bcrypt.hash = jest.fn(() => {
				throw new Error('Error in generating hash');
			});
			expect(() => encryptPassword('password')).rejects.toThrow(Error);
		});
	});
});

describe('UTILS isValidPassword', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});
	describe('when compare function is working properly', () => {
		test('calls compare function', async () => {
			bcrypt.compare = jest.fn();

			await isPasswordValid('password', 'password');
			expect(bcrypt.compare).toHaveBeenCalled();
		});
	});
	describe('when compare function is not working properly', () => {
		test('throw error', () => {
			bcrypt.compare = jest.fn(() => {
				throw new Error('Error');
			});

			expect(() => isPasswordValid('password', 'password')).rejects.toThrow();
		});
	});
});
