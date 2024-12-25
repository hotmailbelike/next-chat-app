'use client';

import { useState } from 'react';
import { credentialsSignup } from '@/actions/credentials-signup';
import { useRouter } from 'next/navigation';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CredentialsSignupForm() {
	const router = useRouter();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [showSuccessAlert, setShowSuccessAlert] = useState(false);

	const handleCredentialsSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError('');

		try {
			const res = await credentialsSignup({
				name,
				email,
				password,
				confirmPassword,
			});

			if (res?.error) throw res.error;

			setShowSuccessAlert(true);
		} catch (error) {
			console.error(
				'📣 -> file: credentials-signup-form.tsx:36 -> handleCredentialsSubmit -> error:',
				error
			);
			setError(error as string);
		}
	};

	return (
		<form className='mt-8 space-y-6' onSubmit={handleCredentialsSubmit}>
			<div>
				<label htmlFor='name' className='sr-only'>
					Name
				</label>
				<input
					id='name'
					type='text'
					required
					className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300'
					placeholder='Full name'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

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
			<div>
				<label htmlFor='confirm-password' className='sr-only'>
					Confirm Password
				</label>
				<input
					id='confirm-password'
					type='password'
					required
					className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300'
					placeholder='Confirm Password'
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
			</div>

			{error && <div className='text-red-500 text-sm'>{error}</div>}

			<button
				type='submit'
				className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700'
			>
				Sign up
			</button>

			<AlertDialog open={showSuccessAlert}>
				{/* <AlertDialogTrigger asChild>
					<Button variant='outline'>Show Dialog</Button>
				</AlertDialogTrigger> */}
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Sign Up Successful!</AlertDialogTitle>
						<AlertDialogDescription>
							Use your new credentials to log in.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction type='button' onClick={() => router.push('/login')}>
							Continue to Login
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</form>
	);
}
