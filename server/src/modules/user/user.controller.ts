import { NextFunction, Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import passport from 'passport';
import User, { IUser } from './user.model';
import { issueJWT } from './user.utils';

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.user) {
			return res.sendStatus(400);
		}

		const jwt = await issueJWT(req.user as any);
		return res.status(200).json(jwt);
	} catch (error) {
		console.log(error);
		return res.status(500);
	}
};

export const userRegister = async (req: Request, res: Response) => {
	try {
		const newUser = await new User(req.body).save();
		const jwt = await issueJWT(newUser);

		return res.status(200).json({ token: 'token', expires: 'expires' });
	} catch (error) {
		console.log(error);
	}
};

export const userProfile = async (req: Request, res: Response, next: NextFunction) => {
	return res.sendStatus(200);
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
	return res.redirect('/redirected');
};

export const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await passport.authenticate('google', { session: false });
		const jwt = await issueJWT(req.user as HydratedDocument<IUser>);

		return res.status(200).json({ token: 'token', expires: 'expires' });
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

export const facebookAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await passport.authenticate('facebook', { session: false });
		const jwt = await issueJWT(req.user as HydratedDocument<IUser>);

		return res.status(200).json({ token: 'token', expires: 'expires' });
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};
