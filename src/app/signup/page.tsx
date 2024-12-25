import Link from 'next/link';
import CredentialsSignupForm from './components/credentials-signup-form';
import { signIn } from '@/auth';

export default function Signup() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold'>Create your account</h2>
				</div>

				<CredentialsSignupForm />

				<form
					action={async () => {
						'use server';
						await signIn('google', {
							redirectTo: '/chat-dashboard',
						});
					}}
				>
					<button
						type='submit'
						className='w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50'
					>
						<div className='flex justify-center items-center '>
							<div className='mr-2'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='20px'
									height='20px'
									viewBox='-3 0 262 262'
									preserveAspectRatio='xMidYMid'
								>
									<path
										d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'
										fill='#4285F4'
									/>
									<path
										d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'
										fill='#34A853'
									/>
									<path
										d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782'
										fill='#FBBC05'
									/>
									<path
										d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'
										fill='#EB4335'
									/>
								</svg>
							</div>
							Continue with Google
						</div>
					</button>
				</form>

				<p className='text-center text-sm text-gray-600'>
					Already have an account?{' '}
					<Link href='/login' className='text-blue-600 hover:text-blue-500'>
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}