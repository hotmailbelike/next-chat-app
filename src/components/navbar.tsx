import { signOut, auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Navbar() {
	const session = await auth();

	if (!session) {
		redirect('/login');
	}

	return (
		<nav className='bg-white border-b border-gray-200 fixed w-full z-10'>
			<div className='max-w-full mx-auto px-4'>
				<div className='flex justify-between h-16'>
					<div className='flex'>
						<div className='flex items-center'>
							<span className='text-xl font-bold text-gray-800'>Next Chat App</span>
						</div>
					</div>

					<div className='flex items-center space-x-4'>
						<div className='flex items-center space-x-2'>
							{session?.user?.image && (
								<div className='w-8 h-8 rounded-full overflow-hidden'>
									<img src={session.user.image} alt='user image' />
								</div>
							)}
							<span className='text-gray-600'>
								{session?.user?.name}
								{session.user.role === 'ADMIN' && ' (Admin)'}
							</span>
						</div>
						{session.user.role === 'ADMIN' && (
							<Link href='/admin-panel'>
								<button
									type='button'
									className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
								>
									Admin Panel
								</button>
							</Link>
						)}
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
