import * as db from './startapp/db';

export default function setUp() {
	beforeAll(async () => {
		try {
			await db.connect();
			console.log('db connected');
		} catch (error) {
			console.log(error);
		}
	});
	afterAll(async () => {
		try {
			await db.disconnect();
			console.log('db disconnected');
		} catch (error) {
			console.log(error);
		}
	});
}
