'use server';
import { prisma } from '@/prisma';

export const createDefaultGroups = async () => {
	const adminChat = await prisma.group.findFirst({
		where: {
			name: 'Admin Chat',
		},
	});

	const generalChat = await prisma.group.findFirst({
		where: {
			name: 'General Chat',
		},
	});

	if (!adminChat) {
		await prisma.group.create({
			data: {
				name: 'Admin Chat',
			},
		});
	}

	if (!generalChat) {
		await prisma.group.create({
			data: {
				name: 'General Chat',
			},
		});
	}
};
