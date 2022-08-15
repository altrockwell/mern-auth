import mongoose from 'mongoose';

export async function disconnect() {
	try {
		await mongoose.disconnect();
		if (process.env.NODE_ENV !== 'test') {
			console.log('DB disconnected');
		}
	} catch (err) {
		console.log(err);
	}
}

export async function connect() {
	const db = process.env.APP_DB_URL as string;
	return mongoose
		.connect(db)
		.then(() => {
			if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
				console.log(`Connected to ${db}`);
			}
		})
		.catch((err) => {
			console.log(err);
		});
}
