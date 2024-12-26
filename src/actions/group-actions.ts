'use server';
import { prisma } from '@/prisma';

export const listGroups = async () => {
	const groups = await prisma.group.findMany();

	return groups;
};

export const createGroup = async (name: string) => {
	const group = await prisma.group.create({
		data: {
			name,
		},
	});

	return group;
};

export const deleteGroup = async (id: string) => {
	const group = await prisma.group.delete({
		where: {
			id,
		},
	});

	await prisma.message.deleteMany({
		where: {
			groupId: id,
		},
	});

	return group;
};
