import { userLogin, userRegister, userProfile } from './user.controller';
import { Router } from 'express';
import { validateUserRequest, isAuthHeaderSent } from './user.middleware';
import passport from 'passport';

const userRouter = Router();

userRouter.post('/register', validateUserRequest, userRegister);
userRouter.post('/login', validateUserRequest, passport.authenticate('local', { session: false }), userLogin);
userRouter.get('/profile', isAuthHeaderSent, passport.authenticate('jwt', { session: false }), userProfile);

export default userRouter;
