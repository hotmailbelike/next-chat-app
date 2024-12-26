import { listGroups } from '@/actions/group-actions';
import { auth } from '@/auth';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from '@/components/ui/sidebar';

import SideBarButtons from './sidebar-buttons';

export async function AppSidebar() {
	const session = await auth();
	const groups = await listGroups();

	return (
		<Sidebar className='pt-16'>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SideBarButtons groups={groups} role={session?.user.role as string} />
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
