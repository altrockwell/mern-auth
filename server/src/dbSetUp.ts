import * as db from './startapp/db';

export default function setUp() {
	beforeAll(async () => {
		try {
			await db.connect();
		} catch (error) {
			console.log(error);
		}
	});
	afterAll(async () => {
		try {
			await db.disconnect();
		} catch (error) {
			console.log(error);
		}
	});
}
