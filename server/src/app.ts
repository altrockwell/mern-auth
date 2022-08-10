import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import userRouter from './modules/user/user.router';
import passportConfig from './config/passport';
require('dotenv').config();

passportConfig();

const app = express();
app.use(morgan('tiny'));
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', userRouter);

export default app;
