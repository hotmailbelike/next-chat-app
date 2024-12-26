import { z } from 'zod';

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const SignupSchema = z
	.object({
		name: z.string({
			message: 'Please enter your full name',
		}),
		email: z.string().email({
			message: 'Please enter a valid email address',
		}),
		password: z.string().min(8, {
			message: 'Password must be at least 8 characters long',
		}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export const MessageSchema = z.object({
	content: z.string().min(1),
	groupId: z.string(),
	userId: z.string(),
});

export const GroupSchema = z.object({
	name: z.string().min(3).max(50),
});
