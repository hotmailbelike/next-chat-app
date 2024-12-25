import { hash } from 'bcrypt';
import { prisma } from '@/prisma';
import { z } from 'zod';

const signupSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validation = signupSchema.safeParse(body);

		if (!validation.success) {
			return new Response('Invalid input', { status: 400 });
		}

		const { name, email, password } = validation.data;
		const hashedPassword = await hash(password, 10);

		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: 'MEMBER',
			},
		});

		return new Response('User created', { status: 201 });
	} catch (error: any) {
		if (error.code === 'P2002') {
			return new Response('Email already exists', { status: 400 });
		}
		return new Response('Error creating user', { status: 500 });
	}
}
