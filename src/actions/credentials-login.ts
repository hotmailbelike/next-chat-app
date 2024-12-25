'use server';

import * as z from 'zod';
import { LoginSchema } from '@/lib/validation';
import { signIn } from '@/auth';

export const credentialsLogin = async (data: z.infer<typeof LoginSchema>) => {
	try {
		const validatedData = LoginSchema.parse(data);

		if (!validatedData) {
			return { error: 'Invalid input data' };
		}

		const { email, password } = validatedData;

		await signIn('credentials', {
			email,
			password,
			redirect: false,
		});
	} catch (error) {
		console.error(
			'📣 -> file: credentials-login.ts:26 -> credentialsLogin -> error:',
			error
		);

		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		} else {
			return { error: 'Invalid credentials' };
		}
	}
};
