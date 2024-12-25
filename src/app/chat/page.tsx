'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export default function ChatDashboard() {
	const { data: session } = useSession();
	const [messages, setMessages] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState('general-chat');

	useEffect(() => {
		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
		});

		const channel = pusher.subscribe(`chat-${selectedGroup}`);
		channel.bind('new-message', (message: any) => {
			setMessages((prev) => [...prev, message]);
		});

		return () => {
			pusher.unsubscribe(`chat-${selectedGroup}`);
		};
	}, [selectedGroup]);

	// Implement message sending and UI rendering
	<div>chat </div>;
}
