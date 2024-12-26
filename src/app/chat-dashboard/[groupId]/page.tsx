import { auth } from '@/auth';
import ChatGroup from './components/chat-group';

export default async function GroupChat({
	params,
}: {
	params: Promise<{ groupId: string }>;
}) {
	const session = await auth();
	const groupId = (await params).groupId;

	if (!session?.user && !groupId) {
		return null;
	}

	return <ChatGroup groupId={groupId} user={session?.user} />;
}
