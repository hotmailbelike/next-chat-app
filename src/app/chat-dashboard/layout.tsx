import Navbar from '@/components/navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function ChatDashboardLayout({ children }: { children: React.ReactNode }) {
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
