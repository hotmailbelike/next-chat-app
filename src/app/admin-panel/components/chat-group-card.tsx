'use client';
import { deleteGroup } from '@/actions/group-actions';

export default function ChatGroupCard({
	groupId,
	groupName,
}: {
	groupId: string;
	groupName: string;
}) {
	return (
		<div key={groupId} className='bg-white shadow-md rounded-lg p-4 mb-4'>
			<div className='flex flex-col'>
				<span className='font-medium text-lg mb-2 text-center'>{groupName}</span>
				{groupName !== 'Admin Chat' && groupName !== 'General Chat' ? (
					<button
						className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md self-center'
						type='button'
						onClick={async () => {
							await deleteGroup(groupId);
							window.location.reload();
						}}
					>
						Delete
					</button>
				) : (
					<button
						className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md self-center'
						type='button'
						disabled
					>
						Delete
					</button>
				)}
			</div>
		</div>
	);
}
