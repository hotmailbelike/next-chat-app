export async function GET(request: Request) {
	console.log('📣 -> file: route.ts:5 -> GET -> request:', request);
	const data = { id: 1, name: 'John Doe' };
	return Response.json({ data });
}
