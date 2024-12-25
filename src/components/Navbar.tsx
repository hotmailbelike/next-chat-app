import { signOut, auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Navbar() {
	const session = await auth();
	console.log('📣 -> file: Navbar.tsx:7 -> Navbar -> session:', session);

	if (!session) {
		redirect('/login');
	}

	return (
		<nav className='bg-white border-b border-gray-200 fixed w-full z-10'>
			<div className='max-w-full mx-auto px-4'>
				<div className='flex justify-between h-16'>
					<div className='flex'>
						<div className='flex items-center'>
							<Link href='/chat' className='text-xl font-bold text-gray-800'>
								Chat App
							</Link>
						</div>
					</div>

					<div className='flex items-center space-x-4'>
						{/* {session?.user?.role === 'ADMIN' && (
							<Link href='/admin' className='text-gray-600 hover:text-gray-800'>
								Admin Panel
							</Link>
						)} */}
						<span className='text-gray-600'>{session?.user?.name}</span>
						<button
							type='button'
							onClick={async () => {
								'use server';
								await signOut({
									redirectTo: '/login',
								});
							}}
							className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md'
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
