// import ChatSidebar from '@/components/ChatSidebar';
import Navbar from '@/components/Navbar';

export default function ChatDashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Navbar />
			<div className='flex pt-16'>
				{/* <ChatSidebar /> */}
				<main className='flex-1'>{children}</main>
			</div>
		</div>
	);
}
