import { getServerSession } from 'next-auth';
import { pusher } from '@/lib/pusher';
import { z } from 'zod';
import prisma from '@/prisma';

const messageSchema = z.object({
	content: z.string().min(1),
	groupId: z.string(),
});

export async function POST(req: Request) {
	const session = await getServerSession();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const body = await req.json();
	const validation = messageSchema.safeParse(body);
	if (!validation.success) {
		return new Response('Invalid message', { status: 400 });
	}

	const { content, groupId } = validation.data;

	// Check authorization
	const user = await prisma.user.findUnique({
		where: { email: session?.user?.email! },
	});

	if (user?.role !== 'ADMIN' && groupId === 'admin-chat') {
		return new Response('Unauthorized', { status: 403 });
	}

	const message = await prisma.message.create({
		data: {
			content,
			groupId,
			userId: user!.id,
		},
		include: { user: true },
	});

	await pusher.trigger(`chat-${groupId}`, 'new-message', message);
	return Response.json(message);
}
