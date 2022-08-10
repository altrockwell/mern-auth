import https from 'https';
import fs from 'fs';
import app from './app';
// import mongoose from 'mongoose';
import * as db from './startapp/db';

const port = process.env.APP_PORT || 8000;

db.connect();

const server = https.createServer(
	{ key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') },
	app
);

server.listen(port, () => {
	console.log('Server running on https://localhost:' + port);
});
