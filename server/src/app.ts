import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import bodyParser from 'body-parser';
import userRouter from './modules/user/user.router';
import passportConfig from './config/passport';
require('dotenv').config();

passportConfig();

const app = express();
if (app.get('env') === 'development') {
	app.use(morgan('tiny'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/auth', userRouter);

export default app;
