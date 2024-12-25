import { listGroups } from '@/actions/group-actions';
import CreateGroupForm from './components/create-group-form';
import ChatGroupCard from './components/chat-group-card';

export default async function AdminPanel() {
	const chatGroups = await listGroups();

	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<h1 className='font-bold text-2xl'>List of Chat Groups:</h1>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				{/* Left Column: List of Chat Groups */}
				<div>
					{chatGroups.map(({ id, name }) => (
						<ChatGroupCard groupId={id} groupName={name} />
					))}
				</div>

				{/* Right Column: Create Group Form */}
				<div className='bg-white shadow-md rounded-lg p-4 h-fit'>
					<h2 className='font-semibold text-xl mb-4'>Create Chat Group</h2>
					<CreateGroupForm />
				</div>
			</div>
		</>
	);
}
