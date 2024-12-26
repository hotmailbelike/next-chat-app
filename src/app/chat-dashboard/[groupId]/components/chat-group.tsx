'use client';

import { useEffect, useState, useRef } from 'react';
// import Pusher from 'pusher-js';
import { Session } from 'next-auth';
import { Message as PrismaMessage, User, Group } from '@prisma/client';
import { createMessage, listMessagesByGroup } from '@/actions/message-actions';
import pusherClient from '@/lib/pusher';

type Message = PrismaMessage & {
	user: User;
	group: Group;
};

export default function ChatGroup({
	groupId,
	user,
}: {
	groupId: string;
	user?: Session['user'];
}) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const [loading, setLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const observerTarget = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Scroll to bottom on new message
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const formatMessageDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return `Today at ${date.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			})}`;
		} else if (date.toDateString() === yesterday.toDateString()) {
			return `Yesterday at ${date.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			})}`;
		} else {
			return date.toLocaleDateString([], {
				month: 'short',
				day: 'numeric',
				year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
			});
		}
	};

	useEffect(() => {
		let cursor: string | null = null;
		let isLoading = false;

		const loadMessages = async () => {
			if (isLoading || !hasMore) return;

			isLoading = true;
			setLoading(true);

			try {
				// const queryParams = new URLSearchParams();
				// queryParams.append('groupId', groupId);
				// if (cursor) queryParams.append('cursor', cursor);

				// const response = await fetch(`/api/messages?${queryParams}`);
				// const data = await response.json();
				const data = await listMessagesByGroup(groupId);

				if (data.length < 50) {
					// Assuming page size is 50
					setHasMore(false);
				}

				if (data.length > 0) {
					cursor = data[data.length - 1].id;
					setMessages((prev) => [...prev, ...data]);
				}
			} catch (error) {
				console.error('Failed to fetch messages:', error);
			} finally {
				isLoading = false;
				setLoading(false);
			}
		};

		// Set up intersection observer for infinite scroll
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					// loadMessages();
				}
			},
			{ threshold: 0.5 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		// Initial load
		loadMessages();

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, []);

	// Set up real-time updates
	useEffect(() => {
		// const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
		// 	cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
		// });

		// const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
		// 	cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
		// });

		const channel = pusherClient.subscribe(`group-${groupId}`);
		channel.bind('new-message', (data: { message: Message }) => {
			setMessages((prev) => [...prev, data.message]);
			// setMessages((prev) => [data.message, ...prev]);

			scrollToBottom();
		});

		return () => {
			// channel.unbind_all();
			// channel.unsubscribe();
			pusherClient.unbind_all();
			pusherClient.unsubscribe(`group-${groupId}`);
		};
	}, []);

	const sendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		try {
			// await fetch('/api/messages', {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({ content: newMessage, groupId }),
			// });
			await createMessage(groupId, user?.id as string, newMessage);
			setNewMessage('');
		} catch (error) {
			console.error('Failed to send message:', error);
		}
	};

	useEffect(() => {
		if (!loading && messages.length > 0) {
			scrollToBottom();
		}
	}, [loading, messages.length]);

	return (
		<div className='flex flex-col h-full bg-gray-50 mb-10'>
			<div className='flex-1 overflow-y-auto p-4'>
				{loading ? (
					<div className='flex justify-center items-center h-full'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
					</div>
				) : messages.length === 0 ? (
					<div className='flex flex-col items-center justify-center h-full text-gray-500 space-y-4'>
						<div className='text-xl font-medium'>No messages yet</div>
						<div className='text-sm'>Be the first to send a message!</div>
					</div>
				) : (
					<div className='space-y-6'>
						{messages.map((message) => (
							<div
								key={`${message.id}-${message.user.name}`}
								className='flex space-x-3 group hover:bg-gray-100 p-2 rounded-lg'
							>
								{/* Avatar */}
								<div className='flex-shrink-0'>
									<div className='w-10 h-10 rounded-full overflow-hidden'>
										{message?.user?.image ? (
											<img
												src={message.user.image}
												alt={message.user.name}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full bg-blue-600 flex items-center justify-center text-white font-medium'>
												{getInitials(message.user.name)}
											</div>
										)}
									</div>
								</div>

								{/* Message Content */}
								<div className='flex-1 min-w-0'>
									<div className='flex items-baseline'>
										<span className='text-sm font-medium text-gray-900'>
											{message.user.name}
										</span>
										<span className='ml-2 text-xs text-gray-500'>
											{formatMessageDate(message.createdAt as unknown as string)}
										</span>
									</div>
									<div className='mt-1 text-sm text-gray-800'>{message.content}</div>
								</div>
							</div>
						))}
						{/* <div ref={observerTarget} className='h-4' /> */}
						{/* <div ref={messagesEndRef} className='' /> */}
					</div>
				)}
			</div>

			{/* Message Input */}
			<div className='border-t bg-white p-4' ref={messagesEndRef}>
				<form onSubmit={sendMessage} className='flex space-x-2'>
					<input
						type='text'
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder='Send a message...'
						className='flex-1 min-w-0 rounded-full bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white'
					/>
					<button
						type='submit'
						disabled={!newMessage.trim()}
						className='inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						Send
					</button>
				</form>
			</div>
		</div>
	);
}
