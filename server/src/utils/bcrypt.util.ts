import bycrpt from 'bcrypt';

export const encryptPassword = async (password: string) => {
	// should generate salt
	const salt = await bycrpt.genSalt(10);

	// should hash password
	return await bycrpt.hash(password, salt);
	// should not return plain password
};
