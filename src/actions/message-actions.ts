'use server';
import { prisma } from '@/prisma';
import Pusher from 'pusher';
import { MessageSchema } from '@/lib/validation';

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID!,
	key: process.env.PUSHER_KEY!,
	secret: process.env.PUSHER_SECRET!,
	cluster: process.env.PUSHER_CLUSTER!,
	useTLS: true,
});

export const listMessagesByGroup = async (groupId: string, cursor?: string) => {
	const limit = 50;

	const messages = await prisma.message.findMany({
		where: { groupId },
		take: limit,
		skip: cursor ? 1 : 0,
		cursor: cursor ? { id: cursor } : undefined,
		orderBy: { createdAt: 'desc' },
		include: {
			user: true,
			group: true,
		},
	});

	return messages;
};

export const createMessage = async (groupId: string, userId: string, content: string) => {
	MessageSchema.parse({ groupId, userId, content });

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
