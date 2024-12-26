'use server';
import { prisma } from '@/prisma';
import Pusher from 'pusher';

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID!,
	key: process.env.PUSHER_KEY!,
	secret: process.env.PUSHER_SECRET!,
	cluster: process.env.PUSHER_CLUSTER!,
	useTLS: true,
});

export const listMessagesByGroup = async (groupId: string) => {
	const messages = await prisma.message.findMany({
		where: {
			groupId,
		},
		include: {
			user: true,
			group: true,
		},
		orderBy: {
			createdAt: 'asc',
		},
	});

	return messages;
};

export const createMessage = async (groupId: string, userId: string, content: string) => {
	const message = await prisma.message.create({
		data: {
			content,
			groupId,
			userId,
		},
		include: {
			user: true,
			group: true,
		},
	});

	await pusher.trigger(`group-${groupId}`, 'new-message', {
		message,
	});

	return message;
};
