import bycrpt from 'bcrypt';

export const encryptPassword = async (password: string): Promise<string> => {
	try {
		const salt = await bycrpt.genSalt(10);
		return await bycrpt.hash(password, salt);
	} catch (error) {
		throw new Error('Error in generating salt');
	}
};

export const isPasswordValid = async (password: string, hashedPassword: string): Promise<boolean> => {
	return await bycrpt.compare(password, hashedPassword);
};
