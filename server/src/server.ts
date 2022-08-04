import https from 'https';
import fs from 'fs';
import app from './app';
import mongoose from 'mongoose';

const port = process.env.APP_PORT || 8000;
mongoose.connect('mongodb://127.0.0.1:27017/mern_auth', () => {
	console.log('Connected to Database');
});

const server = https.createServer(
	{ key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') },
	app
);

server.listen(port, () => {
	console.log('Server running on https://localhost:' + port);
});
