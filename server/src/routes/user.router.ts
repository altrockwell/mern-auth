import { IUser } from './../models/user.model';
import { issueJWT } from './../utils/jwt.util';
import express from 'express';
import { findOrCreate } from '../services/user.service';
import passport from 'passport';

const userRouter = express.Router();

userRouter.post(
	'/login',
	function (req, res, next) {
		if (!req.body.uuid || !req.body.password) {
			return res.status(400);
		}
		next();
	},
	passport.authenticate('local', { session: false }),
	async (req, res) => {
		if (req.user) {
			try {
				console.log('user is ', req.user);
				const { token, expires } = await issueJWT(req.user as IUser);
				return res.status(200).json({ token, expires });
			} catch (error) {
				return res.status(400).json(error);
			}
		}
	}
);

userRouter.post('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/auth/failed',
		failureMessage: 'Google Authentication Failed',
		session: false,
	})
);

export default userRouter;
