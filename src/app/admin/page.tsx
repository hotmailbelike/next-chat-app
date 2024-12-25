'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { z } from 'zod';

const groupSchema = z.object({
	name: z.string().min(3),
});

export default function AdminPanel() {
	const { data: session } = useSession();
	const [groupName, setGroupName] = useState('');

	if (session?.user?.role !== 'ADMIN') {
		return <div>Unauthorized</div>;
	}

	const createGroup = async () => {
		const validation = groupSchema.safeParse({ name: groupName });
		if (!validation.success) return;

		await fetch('/api/groups', {
			method: 'POST',
			body: JSON.stringify({ name: groupName }),
		});
	};

	// Implement group management UI
	return <div>admin panel</div>;
}
