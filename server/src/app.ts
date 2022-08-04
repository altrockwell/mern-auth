import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import userRouter from './routes/user.router';
import passportConfig from './config/passport';

passportConfig();

const app = express();
app.use(morgan('tiny'));
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', userRouter);

export default app;
