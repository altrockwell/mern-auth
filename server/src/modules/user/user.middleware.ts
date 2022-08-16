import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validateUserRequest = async (req: Request, res: Response, next: NextFunction) => {
	const schema = Joi.object({
		uuid: Joi.string().email().min(5).max(255).required(),
		password: Joi.string()
			.min(6)
			.max(255)
			.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
			.required(),
	});

	const { error } = await schema.validate(req.body);
	if (error) {
		// console.log(error);
		return res.sendStatus(400);
	}

	return next();
};

export const isAuthHeaderSent = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;

	if (!token) {
		return res.sendStatus(401);
	}

	next();
};

export const isgoogleRequestValid = async (req: Request, res: Response, next: NextFunction) => {
	const code = req.query.code;
	const scope = req.query.scope;

	if (!code || !scope) {
		return res.sendStatus(400);
	}
	return next();
};

export const isFacebookRequestValid = async (req: Request, res: Response, next: NextFunction) => {
	const code = req.query.code;

	if (!code) {
		return res.sendStatus(400);
	}
	return next();
};
