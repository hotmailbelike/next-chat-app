import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export function useMessages(groupId: string) {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const { data: session } = useSession();

	const fetchMessages = useCallback(
		async (cursor?: string) => {
			if (!session || loading || !hasMore) return;

			setLoading(true);
			try {
				const params = new URLSearchParams();
				if (cursor) params.set('cursor', cursor);

				const response = await fetch(`/api/messages/${groupId}?${params.toString()}`);
				const newMessages = await response.json();

				setMessages((prev) => [...prev, ...newMessages]);
				setHasMore(newMessages.length === 20);
			} finally {
				setLoading(false);
			}
		},
		[groupId, session, loading, hasMore]
	);

	return { messages, loading, hasMore, fetchMessages };
}
