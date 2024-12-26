'use client';

import { useParams } from 'next/navigation';

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';

export default function SideBarButtons({
	groups,
	role,
}: {
	groups: { id: string; name: string }[];
	role: string;
}) {
	const params = useParams<{ groupId: string }>();

	return (
		<>
			{role !== 'ADMIN'
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
							<SidebarMenuButton
								asChild
								className={group.id === params.groupId ? 'bg-gray-200' : ''}
							>
								<Link href={'/chat-dashboard/' + group.id}>
									<span>{group.name}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
				  ))}
		</>
	);
}
