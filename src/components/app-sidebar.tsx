import { listGroups } from '@/actions/group-actions';
import { auth } from '@/auth';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export async function AppSidebar() {
	const session = await auth();
	const groups = await listGroups();

	return (
		<Sidebar className='pt-16'>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{session?.user.role !== 'ADMIN'
								? groups
										.filter(({ name }) => name !== 'Admin Chat')
										.map((group) => (
											<SidebarMenuItem key={group.id}>
												<SidebarMenuButton asChild>
													<Link href={'/chat-dashboard/' + group.id}>
														<span>{group.name}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))
								: groups.map((group) => (
										<SidebarMenuItem key={group.id}>
											<SidebarMenuButton asChild>
												<Link href={'/chat-dashboard/' + group.id}>
													<span>{group.name}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
								  ))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
