import Navbar from '@/components/navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function ChatDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (session?.user?.role !== 'ADMIN') {
		redirect('/login');
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<Navbar />
			<div className='pt-28 px-16 w-full'>
				<main>{children}</main>
			</div>
		</SidebarProvider>
	);
}
