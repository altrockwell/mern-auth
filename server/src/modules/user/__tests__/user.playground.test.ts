import * as db from '../../../startapp/db';
import User from '../user.model';
import { issueJWT } from '../user.utils';
import dbSetUp from '../../../dbSetUp';

dbSetUp();

beforeEach(async () => {
	await User.deleteMany({});
});
test('if jwt work', async () => {
	const newUser = await new User({ uuid: 'a@a.com', password: 'password' });
	await newUser.save();
	const jwt = await issueJWT(newUser);

	console.log(jwt);
	expect(jwt).toBeTruthy();
});
