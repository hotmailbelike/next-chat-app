'use server';
import { GroupSchema } from '@/lib/validation';
import { prisma } from '@/prisma';

export const listGroups = async () => {
	const groups = await prisma.group.findMany();

	return groups;
};

export const createGroup = async (name: string) => {
	GroupSchema.parse({ name });

	const group = await prisma.group.create({
		data: {
			name,
		},
	});

	return group;
};

export const deleteGroup = async (id: string) => {
	await prisma.message.deleteMany({
		where: {
			groupId: id,
		},
	});

	const group = await prisma.group.delete({
		where: {
			id,
		},
	});

	return group;
};
