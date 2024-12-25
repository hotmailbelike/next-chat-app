import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';
import { compare } from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { encode as defaultEncode } from 'next-auth/jwt';

const adapter = PrismaAdapter(prisma); // TODO: Fix this type error - DrizzleAdapter doesn't export a type that we can use here

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter,
	providers: [
		Google,
		Credentials({
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				try {
					if (!credentials?.email || !credentials.password) return null;

					const user = await prisma.user.findUnique({
						where: { email: credentials.email as string },
					});

					if (
						!user ||
						!(await compare(credentials.password as string, user.password as string))
					) {
						throw new Error('Invalid email or password');
					}

					return user;
				} catch (error) {
					console.error('📣 -> file: auth.ts:43 -> authorize: -> error:', error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async session({ session, user }) {
			session.user.id = user.id;
			//@ts-ignore
			session.user.role = user.role;
			return session;
		},
		async jwt({ token, user, account }) {
			if (account?.provider === 'credentials') {
				token.credentials = true;
			}

			if (user) {
				token.id = user.id;
				//@ts-ignore
				token.role = user.role;
			}
			return token;
		},
	},
	jwt: {
		encode: async function (params) {
			if (params.token?.credentials) {
				const sessionToken = randomUUID();

				if (!params.token.sub) {
					throw new Error('No user ID found in token');
				}

				const createdSession = await adapter?.createSession?.({
					sessionToken: sessionToken,
					userId: params.token.sub,
					expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
				});

				if (!createdSession) {
					throw new Error('Failed to create session');
				}

				return sessionToken;
			}
			return defaultEncode(params);
		},
	},
});
