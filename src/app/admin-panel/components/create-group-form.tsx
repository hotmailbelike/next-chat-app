'use client';

import { listGroups, createGroup } from '@/actions/group-actions';

export default function CreateGroupForm() {
	const handleCreateChatGroupSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const groupName = formData.get('groupName') as string;

		if (['Admin Chat', 'General Chat'].includes(groupName)) {
			alert('You cannot create a group with this name');
		}

		if (groupName.trim()) {
			try {
				await createGroup(groupName);
				await listGroups();

				window.location.reload();
			} catch (error) {
				console.error('Error creating group:', error);
			}
		}
	};
	return (
		<form onSubmit={handleCreateChatGroupSubmit}>
			<div className='mb-4'>
				<label htmlFor='groupName' className='block text-gray-700 mb-2'>
					Group Name
				</label>
				<input
					id='groupName'
					type='text'
					name='groupName'
					className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					placeholder='Enter group name'
					required
				/>
			</div>
			<button
				type='submit'
				className='w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
			>
				Create Group
			</button>
		</form>
	);
}
