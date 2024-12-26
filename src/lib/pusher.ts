// import Pusher from 'pusher';

// export const pusher = new Pusher({
// 	appId: process.env.PUSHER_APP_ID!,
// 	key: process.env.PUSHER_KEY!,
// 	secret: process.env.PUSHER_SECRET!,
// 	cluster: process.env.PUSHER_CLUSTER!,
// 	useTLS: true,
// });

import Pusher from 'pusher-js';

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
	cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export default pusherClient;
