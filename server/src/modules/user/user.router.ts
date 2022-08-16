import {
	userLogin,
	userRegister,
	userProfile,
	googleAuth,
	googleAuthCallback,
	facebookAuthCallback,
} from './user.controller';
import { Router } from 'express';
import {
	validateUserRequest,
	isAuthHeaderSent,
	isgoogleRequestValid,
	isFacebookRequestValid,
} from './user.middleware';
import passport from 'passport';

const userRouter = Router();

userRouter.post('/register', validateUserRequest, userRegister);
userRouter.post('/login', validateUserRequest, passport.authenticate('local', { session: false }), userLogin);
userRouter.get('/profile', isAuthHeaderSent, passport.authenticate('jwt', { session: false }), userProfile);
userRouter.get('/google/callback', isgoogleRequestValid, googleAuthCallback);
userRouter.get('/google', passport.authenticate('google', { scope: ['profile'] }));
userRouter.get('/facebook/callback', isFacebookRequestValid, facebookAuthCallback);
userRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
userRouter.get('/failed', (req, res) => {
	return res.status(400).send('Auth Failed');
});

export default userRouter;
