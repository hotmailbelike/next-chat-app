// types/index.ts
export interface Message {
	id: string;
	content: string;
	groupId: string;
	userId: string;
	createdAt: Date;
	user: User;
}

export interface User {
	id: string;
	name: string;
	email: string;
	role: 'ADMIN' | 'MEMBER';
}

export interface Group {
	id: string;
	name: string;
}
