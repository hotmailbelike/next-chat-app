'use client';

import { credentialsLogin } from '@/actions/credentials-login';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [error, setError] = useState('');

	const handleCredentialsSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError('');

		try {
			const res = await credentialsLogin({
				email,
				password,
			});

			if (res?.error) throw res.error;

			router.push('/chat-dashboard');
		} catch (error) {
			console.error(
				'📣 -> file: credentials-login-form.tsx:32 -> handleCredentialsSubmit -> error:',
				error
			);
			setError(error as string);
		}
	};
	return (
		<form
			className='mt-8 space-y-6' /* onSubmit={handleSubmit} */
			onSubmit={handleCredentialsSubmit}
		>
			<div>
				<label htmlFor='email' className='sr-only'>
					Email
				</label>
				<input
					id='email'
					type='email'
					required
					className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300'
					placeholder='Email address'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>

			<div>
				<label htmlFor='password' className='sr-only'>
					Password
				</label>
				<input
					id='password'
					type='password'
					required
					className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>

			{error && <div className='text-red-500 text-sm'>{error}</div>}

			<button
				type='submit'
				className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700'
			>
				Log in
			</button>
		</form>
	);
}
