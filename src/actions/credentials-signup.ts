'use server';

import * as z from 'zod';
import { prisma } from '@/prisma';
import bcrypt from 'bcrypt';
import { SignupSchema } from '@/lib/validation';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export const credentialsSignup = async (data: z.infer<typeof SignupSchema>) => {
	try {
		const validatedData = SignupSchema.parse(data);

		if (!validatedData) {
			return { error: 'Invalid input data' };
		}

		const { email, name, password, confirmPassword } = validatedData;

		if (password !== confirmPassword) {
			return { error: 'Passwords do not match' };
		}

		const hashedPassword = await bcrypt.hash(password, 8);

		const userExists = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (userExists) {
			return { error: 'Email already is in use. Please try another one.' };
		}

		const lowerCaseEmail = email.toLowerCase();

		const avatar = createAvatar(avataaars, {
			seed: name,
		});

		const svg = avatar.toDataUri();

		const user = await prisma.user.create({
			data: {
				email: lowerCaseEmail,
				name,
				password: hashedPassword,
				image: svg,
			},
		});

		return { email: user.email, password: password };
	} catch (error) {
		console.error(
			'📣 -> file: credentials-signup.ts:48 -> credentialsSignup -> error:',
			error
		);

		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		} else if ((error as { code: string }).code === 'ETIMEDOUT') {
			return {
				error: 'Unable to connect to the database. Please try again later.',
			};
		} else if ((error as { code: string }).code === '503') {
			return {
				error: 'Service temporarily unavailable. Please try again later.',
			};
		} else {
			return { error: 'An unexpected error occurred. Please try again later.' };
		}
	}
};
