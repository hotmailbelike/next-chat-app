'use server';

import { signIn } from '@/auth';

export const googleLogin = async () => {
	try {
		await signIn('google', {
			redirectTo: '/chat-dashboard',
		});
	} catch (error) {
		console.error('📣 -> file: google-login.ts:7 -> googleLogin -> error:', error);
	}
};
