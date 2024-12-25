// app/api/messages/[groupId]/route.ts
import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const querySchema = z.object({
	cursor: z.string().optional(),
	limit: z.number().min(1).max(50).default(20),
});

export async function GET(req: Request, { params }: { params: { groupId: string } }) {
	const session = await getServerSession();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const validation = querySchema.safeParse({
		cursor: searchParams.get('cursor'),
		limit: Number(searchParams.get('limit')),
	});

	if (!validation.success) {
		return new Response('Invalid parameters', { status: 400 });
	}

	const { cursor, limit } = validation.data;

	const messages = await prisma.message.findMany({
		where: { groupId: params.groupId },
		take: limit,
		skip: cursor ? 1 : 0,
		cursor: cursor ? { id: cursor } : undefined,
		orderBy: { createdAt: 'desc' },
		include: { user: true },
	});

	return Response.json(messages);
}
